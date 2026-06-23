#!/usr/bin/env python3
"""
yt-ingest — lightweight multimedia ingestion server.
stdlib only. No external deps beyond yt-dlp (used for non-YT sources).
YouTube extraction uses InnerTube API directly to bypass server IP rate-limits.
"""
import http.server
import json
import subprocess
import hashlib
import datetime
import os
import re
import urllib.request
import html
import glob
import tempfile
import threading

KNOWLEDGE_FILE = "/opt/ingest/knowledge.json"
PORT = 8080
lock = threading.Lock()

# InnerTube API constants
_INNERTUBE_KEY = "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w"
_INNERTUBE_URL = f"https://www.youtube.com/youtubei/v1/player?key={_INNERTUBE_KEY}&prettyPrint=false"
_INNERTUBE_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip',
}
_INNERTUBE_CONTEXT = {
    "client": {
        "clientName": "ANDROID_TESTSUITE",
        "clientVersion": "1.9",
        "androidSdkVersion": 30,
        "hl": "en",
        "gl": "US",
        "utcOffsetMinutes": 0
    }
}


# ── Source detection ──────────────────────────────────────────────────────────

def detect_source(url):
    u = url.lower()
    if "youtube.com/watch" in u or "youtu.be/" in u or "youtube.com/shorts" in u:
        return "youtube"
    if "twitter.com" in u or "x.com/" in u:
        return "twitter"
    if u.endswith(".pdf"):
        return "pdf"
    if u.endswith(".mp3") or u.endswith(".m4a") or u.endswith(".ogg") or "podcast" in u:
        return "podcast"
    return "web"


def extract_video_id(url):
    for pattern in [
        r'(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com/shorts/([a-zA-Z0-9_-]{11})',
    ]:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    return None


# ── Subtitle parsers ──────────────────────────────────────────────────────────

def parse_vtt(content):
    content = content.replace('﻿', '')
    blocks = re.split(r'\n\n+', content)
    texts = []
    for block in blocks:
        lines = block.strip().split('\n')
        text_lines = []
        for line in lines:
            if not line or line.startswith('WEBVTT') or line.startswith('NOTE') or '-->' in line:
                continue
            if re.match(r'^\d+$', line):
                continue
            cleaned = re.sub(r'<[^>]+>', '', line).strip()
            if cleaned:
                text_lines.append(cleaned)
        if text_lines:
            texts.append(text_lines[-1])
    deduped, prev = [], None
    for t in texts:
        if t != prev:
            deduped.append(t)
            prev = t
    return ' '.join(deduped)


def parse_json3_captions(data):
    """Parse YouTube's json3 caption format."""
    texts = []
    for event in data.get('events', []):
        segs = event.get('segs', [])
        line = ''.join(s.get('utf8', '') for s in segs).replace('\n', ' ').strip()
        if line:
            texts.append(line)
    return re.sub(r'\s+', ' ', ' '.join(texts)).strip()


# ── YouTube extractor (InnerTube) ─────────────────────────────────────────────

def extract_yt(url):
    """
    Extract YouTube content via InnerTube API.
    Returns (title, content, content_type, error)
    content_type: 'captions' | 'description'
    """
    video_id = extract_video_id(url)
    if not video_id:
        return None, None, None, "Could not extract video ID from URL"

    payload = json.dumps({"context": _INNERTUBE_CONTEXT, "videoId": video_id}).encode('utf-8')
    req = urllib.request.Request(_INNERTUBE_URL, data=payload, headers=_INNERTUBE_HEADERS)

    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode('utf-8'))

    video_details = data.get('videoDetails', {})
    title = video_details.get('title') or url
    description = video_details.get('shortDescription', '').strip()

    # Try caption tracks
    caption_tracks = (
        data.get('captions', {})
            .get('playerCaptionsTracklistRenderer', {})
            .get('captionTracks', [])
    )

    if caption_tracks:
        # Prefer English, then any
        track = next((t for t in caption_tracks if t.get('languageCode', '').startswith('en')), caption_tracks[0])
        base_url = track.get('baseUrl', '')
        if base_url:
            cap_req = urllib.request.Request(base_url + '&fmt=json3', headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(cap_req, timeout=20) as resp:
                cap_data = json.loads(resp.read().decode('utf-8'))
            text = parse_json3_captions(cap_data)
            if text:
                return title, text, 'captions', None

    # Fallback: description
    if description:
        return title, description, 'description', None

    return title, "", None, "No captions or description available"


# ── Other extractors ──────────────────────────────────────────────────────────

def extract_web(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; ingest-bot/1.0)'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode('utf-8', errors='ignore')

    m = re.search(r'<title[^>]*>([^<]+)</title>', raw, re.IGNORECASE)
    title = html.unescape(m.group(1).strip()) if m else url

    raw = re.sub(r'<script[^>]*>.*?</script>', ' ', raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r'<style[^>]*>.*?</style>', ' ', raw, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', raw)
    text = html.unescape(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return title, text


def extract_via_ytdlp(url, tmpdir):
    """yt-dlp subtitle extraction for non-YouTube sources (Twitter, podcasts)."""
    r = subprocess.run(
        ["yt-dlp", "--get-title", "--no-playlist", url],
        capture_output=True, text=True, timeout=30
    )
    title = r.stdout.strip() if r.returncode == 0 else url

    subprocess.run([
        "yt-dlp", "--write-auto-subs", "--write-subs",
        "--sub-langs", "en.*,es.*", "--skip-download",
        "--no-playlist", "--output", f"{tmpdir}/%(id)s.%(ext)s", url
    ], capture_output=True, text=True, timeout=90)

    candidates = glob.glob(f"{tmpdir}/*.vtt") + glob.glob(f"{tmpdir}/*.srt")
    if not candidates:
        return title, None

    with open(candidates[0], 'r', encoding='utf-8', errors='ignore') as f:
        raw = f.read()
    text = parse_vtt(raw) if candidates[0].endswith('.vtt') else raw
    return title, text


def extract_pdf(url):
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        tmp_path = tmp.name
    try:
        urllib.request.urlretrieve(url, tmp_path)
        r = subprocess.run(['pdftotext', tmp_path, '-'], capture_output=True, text=True, timeout=30)
        if r.returncode == 0 and r.stdout.strip():
            return os.path.basename(url), r.stdout.strip(), None
        return os.path.basename(url), "", "pdftotext not available or unreadable PDF"
    finally:
        os.unlink(tmp_path)


# ── Knowledge store ───────────────────────────────────────────────────────────

def load_knowledge():
    if not os.path.exists(KNOWLEDGE_FILE):
        return []
    with open(KNOWLEDGE_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_knowledge(entries):
    with open(KNOWLEDGE_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)


# ── HTTP handler ──────────────────────────────────────────────────────────────

class IngestHandler(http.server.BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        ts = datetime.datetime.utcnow().strftime('%H:%M:%S')
        print(f"[{ts}] {fmt % args}", flush=True)

    def send_json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/health':
            self.send_json(200, {"status": "ok", "service": "yt-ingest", "port": PORT})

        elif self.path == '/list':
            with lock:
                entries = load_knowledge()
            index = [{k: v for k, v in e.items() if k != 'content'} for e in entries]
            self.send_json(200, {"ok": True, "count": len(index), "entries": index})

        else:
            self.send_json(404, {"ok": False, "error": "Not found"})

    def do_POST(self):
        if self.path != '/ingest':
            self.send_json(404, {"ok": False, "error": "Not found"})
            return

        length = int(self.headers.get('Content-Length', 0))
        try:
            body = json.loads(self.rfile.read(length))
        except Exception:
            self.send_json(400, {"ok": False, "error": "Invalid JSON body"})
            return

        url = (body.get('url') or '').strip()
        if not url:
            self.send_json(400, {"ok": False, "error": "Missing 'url' field"})
            return

        uid = hashlib.sha256(url.encode()).hexdigest()[:12]

        with lock:
            entries = load_knowledge()
            existing = next((e for e in entries if e['id'] == uid), None)
        if existing:
            self.send_json(200, {
                "ok": True, "id": uid,
                "title": existing['title'],
                "source_type": existing['source_type'],
                "chars_extracted": len(existing.get('content', '')),
                "note": "already_exists"
            })
            return

        source_type = detect_source(url)

        try:
            content_source = None

            if source_type == 'youtube':
                title, content, content_source, err = extract_yt(url)
                if err and not content:
                    self.send_json(422, {"ok": False, "error": err, "source_type": source_type})
                    return

            elif source_type == 'pdf':
                title, content, err = extract_pdf(url)
                if err and not content:
                    self.send_json(422, {"ok": False, "error": err, "source_type": source_type})
                    return

            elif source_type in ('twitter', 'podcast'):
                try:
                    with tempfile.TemporaryDirectory() as td:
                        title, content = extract_via_ytdlp(url, td)
                    if not content:
                        title, content = extract_web(url)
                except Exception:
                    title, content = extract_web(url)

            else:
                title, content = extract_web(url)

            entry = {
                "id": uid,
                "url": url,
                "source_type": source_type,
                "title": title,
                "content": content or "",
                "ingested_at": datetime.datetime.utcnow().isoformat() + "Z",
                "status": "raw"
            }
            if content_source:
                entry["content_source"] = content_source

            with lock:
                entries = load_knowledge()
                entries.append(entry)
                save_knowledge(entries)

            self.send_json(200, {
                "ok": True,
                "id": uid,
                "title": title,
                "source_type": source_type,
                "chars_extracted": len(content or "")
            })

        except subprocess.TimeoutExpired:
            self.send_json(504, {"ok": False, "error": "Extraction timed out"})
        except urllib.error.URLError as e:
            self.send_json(422, {"ok": False, "error": f"URL error: {e.reason}"})
        except Exception as e:
            self.send_json(500, {"ok": False, "error": str(e)})


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    os.makedirs('/opt/ingest', exist_ok=True)
    server = http.server.ThreadingHTTPServer(('', PORT), IngestHandler)
    print(f"[yt-ingest] listening on :{PORT}", flush=True)
    server.serve_forever()
