#!/usr/bin/env python3
"""
Scrape and download page assets in the highest quality available.

Usage:
  python3 scrape_assets.py \
    --url https://our.weddingg.co/omar-salma-template \
    --out downloaded_assets

Notes:
- Use only on sites/content you own or have explicit permission to archive.
- This script uses Playwright (Chromium) so JS-rendered pages and Cloudflare-proxied pages are handled better than plain requests.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


ASSET_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".gif",
    ".svg",
    ".ico",
    ".bmp",
    ".tif",
    ".tiff",
    ".mp4",
    ".webm",
    ".mov",
    ".m4v",
    ".m3u8",
    ".mp3",
    ".wav",
    ".ogg",
    ".aac",
    ".flac",
    ".m4a",
    ".css",
    ".js",
    ".json",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
    ".pdf",
}

CSS_URL_RE = re.compile(r"url\((?:'|\")?(.*?)(?:'|\")?\)")
ABSOLUTE_OR_PROTOCOL_URL_RE = re.compile(r"(?:(?:https?:)?//[^\s\"'`<>]+)")
ROOT_REL_ASSET_RE = re.compile(
    r"(?:^|[\"'`(\s])(/[^\"'`\s)]+\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|bmp|tiff?|"
    r"mp4|webm|mov|m4v|m3u8|mp3|wav|ogg|aac|flac|m4a|css|js|json|woff2?|ttf|otf|eot|pdf))(?:$|[\"'`)\s])",
    re.IGNORECASE,
)
TEXT_SOURCE_EXTENSIONS = {".js", ".css", ".html", ".json"}


def file_ext_from_url(url: str) -> str:
    path = urlparse(url).path.lower()
    _, ext = os.path.splitext(path)
    return ext


def is_same_origin(base: str, target: str, include_subdomains: bool) -> bool:
    b = urlparse(base)
    t = urlparse(target)
    if not t.scheme.startswith("http"):
        return False
    if include_subdomains:
        return t.netloc == b.netloc or t.netloc.endswith("." + b.netloc)
    return t.netloc == b.netloc


def is_asset_like(url: str) -> bool:
    ext = file_ext_from_url(url)
    return ext in ASSET_EXTENSIONS


def is_downloadable_content_type(content_type: str) -> bool:
    ct = (content_type or "").lower()
    prefixes = ["image/", "video/", "audio/", "font/"]
    if any(ct.startswith(p) for p in prefixes):
        return True
    allowed = [
        "text/css",
        "javascript",
        "application/json",
        "text/javascript",
        "application/octet-stream",
    ]
    return any(k in ct for k in allowed)


def is_allowed_origin(
    base_url: str, url: str, include_subdomains: bool, all_origins: bool
) -> bool:
    if all_origins:
        return urlparse(url).scheme.startswith("http")
    return is_same_origin(base_url, url, include_subdomains)


def choose_best_from_srcset(srcset: str) -> str | None:
    best_url = None
    best_score = -1
    for part in srcset.split(","):
        item = part.strip()
        if not item:
            continue
        pieces = item.split()
        candidate_url = pieces[0]
        score = 0
        if len(pieces) > 1:
            descriptor = pieces[1]
            if descriptor.endswith("w"):
                try:
                    score = int(descriptor[:-1])
                except ValueError:
                    score = 0
            elif descriptor.endswith("x"):
                try:
                    score = int(float(descriptor[:-1]) * 1000)
                except ValueError:
                    score = 0
        if score >= best_score:
            best_score = score
            best_url = candidate_url
    return best_url


def normalize_url(base: str, maybe_relative: str) -> str | None:
    if not maybe_relative:
        return None
    u = maybe_relative.strip()
    if u.startswith("data:") or u.startswith("blob:"):
        return None
    return urljoin(base, u)


def gather_urls_from_html(base_url: str, html: str) -> set[str]:
    soup = BeautifulSoup(html, "lxml")
    urls: set[str] = set()

    attr_names = ["src", "href", "poster", "data-src", "data-bg", "content"]
    for tag in soup.find_all(True):
        for attr in attr_names:
            value = tag.get(attr)
            if isinstance(value, str):
                u = normalize_url(base_url, value)
                if u:
                    urls.add(u)

        srcset = tag.get("srcset")
        if isinstance(srcset, str):
            best = choose_best_from_srcset(srcset)
            if best:
                u = normalize_url(base_url, best)
                if u:
                    urls.add(u)

        style = tag.get("style")
        if isinstance(style, str):
            for match in CSS_URL_RE.findall(style):
                u = normalize_url(base_url, match)
                if u:
                    urls.add(u)

    for style_tag in soup.find_all("style"):
        if style_tag.string:
            for match in CSS_URL_RE.findall(style_tag.string):
                u = normalize_url(base_url, match)
                if u:
                    urls.add(u)

    return urls


def extract_urls_from_text(base_url: str, text: str) -> set[str]:
    found: set[str] = set()

    for raw in ABSOLUTE_OR_PROTOCOL_URL_RE.findall(text):
        u = normalize_url(base_url, raw)
        if u:
            found.add(u)

    for match in ROOT_REL_ASSET_RE.findall(text):
        u = normalize_url(base_url, match)
        if u:
            found.add(u)

    return found


def safe_rel_path(base_netloc: str, asset_url: str) -> Path:
    parsed = urlparse(asset_url)
    raw_path = parsed.path.lstrip("/")
    if not raw_path:
        raw_path = "index"

    if raw_path.endswith("/"):
        raw_path += "index"

    name = Path(raw_path).name
    if "." not in name:
        raw_path += ".bin"

    if parsed.query:
        digest = hashlib.sha1(parsed.query.encode("utf-8")).hexdigest()[:10]
        root, ext = os.path.splitext(raw_path)
        raw_path = f"{root}__q{digest}{ext}"

    return Path(base_netloc) / Path(raw_path)


def download_asset(
    session: requests.Session, url: str, out_root: Path, timeout: int, retries: int
) -> dict:
    rel_path = safe_rel_path(urlparse(url).netloc, url)
    dst = out_root / rel_path
    dst.parent.mkdir(parents=True, exist_ok=True)

    if dst.exists() and dst.stat().st_size > 0:
        return {
            "url": url,
            "path": str(rel_path),
            "status": "skipped_exists",
            "bytes": dst.stat().st_size,
        }

    last_error = ""
    for _ in range(retries):
        try:
            with session.get(url, timeout=timeout, stream=True) as r:
                if r.status_code >= 400:
                    last_error = f"http_{r.status_code}"
                    continue
                with open(dst, "wb") as f:
                    for chunk in r.iter_content(chunk_size=1024 * 64):
                        if chunk:
                            f.write(chunk)
            return {
                "url": url,
                "path": str(rel_path),
                "status": "downloaded",
                "bytes": dst.stat().st_size,
            }
        except requests.RequestException as ex:
            last_error = str(ex)
            time.sleep(0.5)

    return {"url": url, "path": str(rel_path), "status": "failed", "error": last_error}


def try_open_invitation(page) -> None:
    text_candidates = ["tap to open", "open invitation", "you're invited", "open"]

    for candidate in text_candidates:
        try:
            locator = page.get_by_text(re.compile(candidate, re.IGNORECASE)).first
            if locator.count() > 0:
                locator.click(timeout=3000, force=True)
                page.wait_for_timeout(600)
                return
        except Exception:
            continue

    try:
        page.evaluate(
            """
                        () => {
                              const rx = /(tap\\s*to\\s*open|open\\s*invitation|you're\\s*invited|open)/i;
                            const nodes = Array.from(document.querySelectorAll('button, a, div, span, p'));
                            for (const n of nodes) {
                                const t = (n.textContent || '').trim();
                                if (t && rx.test(t)) {
                                    n.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                                    return true;
                                }
                            }
                            return false;
                        }
                        """
        )
        page.wait_for_timeout(600)
    except Exception:
        pass

    page.mouse.click(720, 620)
    page.wait_for_timeout(900)


def collect_network_urls(
    page_url: str, wait_seconds: float
) -> tuple[str, str, str, set[str], dict[str, str], list[dict]]:
    seen_urls: set[str] = set()
    response_types: dict[str, str] = {}
    cookie_dump: list[dict] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 3000})
        page = context.new_page()

        def on_response(resp):
            seen_urls.add(resp.url)
            try:
                ct = (resp.headers or {}).get("content-type", "")
            except Exception:
                ct = ""
            if ct:
                response_types[resp.url] = ct

        page.on("response", on_response)
        try:
            page.goto(page_url, wait_until="networkidle", timeout=120000)
        except Exception:
            page.goto(page_url, wait_until="domcontentloaded", timeout=120000)
            page.wait_for_timeout(2500)

        # Trigger invitation-gate interaction (e.g. tap to open).
        try_open_invitation(page)

        before_open_html = page.content()

        # Scroll to trigger lazy-loaded media.
        page.evaluate(
            """
            async () => {
              const step = 700;
              const delay = ms => new Promise(r => setTimeout(r, ms));
              for (let y = 0; y < document.body.scrollHeight; y += step) {
                window.scrollTo(0, y);
                await delay(120);
              }
              window.scrollTo(0, document.body.scrollHeight);
            }
            """
        )
        page.wait_for_timeout(int(wait_seconds * 1000))

        current_text = page.evaluate("() => (document.body?.innerText || '')")
        if (
            "tap to open" in current_text.lower()
            and "day programme" not in current_text.lower()
        ):
            try_open_invitation(page)
            page.wait_for_timeout(1000)

        after_open_html = page.content()
        after_open_text = page.evaluate("() => (document.body?.innerText || '')")

        seen_urls.update(gather_urls_from_html(page.url, before_open_html))
        seen_urls.update(gather_urls_from_html(page.url, after_open_html))
        try:
            perf_urls = page.evaluate(
                "() => performance.getEntriesByType('resource').map(r => r.name)"
            )
            if isinstance(perf_urls, list):
                seen_urls.update(str(u) for u in perf_urls if isinstance(u, str))
        except Exception:
            pass
        cookie_dump = context.cookies()

        browser.close()

    return (
        before_open_html,
        after_open_html,
        after_open_text,
        seen_urls,
        response_types,
        cookie_dump,
    )


def discover_from_text_sources(
    session: requests.Session,
    base_url: str,
    source_urls: set[str],
    timeout: int,
) -> set[str]:
    discovered: set[str] = set()

    for src_url in sorted(source_urls):
        if file_ext_from_url(src_url) not in TEXT_SOURCE_EXTENSIONS:
            continue
        try:
            resp = session.get(src_url, timeout=timeout)
            if resp.status_code >= 400:
                continue
            text = resp.text
            discovered.update(extract_urls_from_text(src_url, text))
        except requests.RequestException:
            continue

    return discovered


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape and download web page assets.")
    parser.add_argument("--url", required=True, help="Target page URL")
    parser.add_argument("--out", default="downloaded_assets", help="Output directory")
    parser.add_argument(
        "--timeout", type=int, default=30, help="HTTP timeout per file in seconds"
    )
    parser.add_argument("--retries", type=int, default=3, help="Retries per asset")
    parser.add_argument(
        "--include-subdomains",
        action="store_true",
        help="Allow scraping assets from subdomains of the target host",
    )
    parser.add_argument(
        "--all-origins",
        action="store_true",
        help="Allow downloading assets from external origins (CDNs, storage buckets, third parties)",
    )
    args = parser.parse_args()

    out_root = Path(args.out).resolve()
    out_root.mkdir(parents=True, exist_ok=True)

    (
        before_open_html,
        after_open_html,
        after_open_text,
        discovered_urls,
        response_types,
        cookies,
    ) = collect_network_urls(
        args.url,
        wait_seconds=2.5,
    )

    before_html_path = out_root / "before_open.html"
    before_html_path.write_text(before_open_html, encoding="utf-8")

    after_html_path = out_root / "after_open.html"
    after_html_path.write_text(after_open_html, encoding="utf-8")

    after_text_path = out_root / "after_open_visible_text.txt"
    after_text_path.write_text(after_open_text, encoding="utf-8")

    # Keep compatibility with previous output naming.
    html_path = out_root / "page.html"
    html_path.write_text(after_open_html, encoding="utf-8")

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Referer": args.url,
            "Accept": "*/*",
        }
    )

    for c in cookies:
        # Keep Cloudflare/session cookies for follow-up downloads.
        session.cookies.set(
            c.get("name", ""),
            c.get("value", ""),
            domain=c.get("domain"),
            path=c.get("path", "/"),
        )

    # Expand discovery by parsing JS/CSS/HTML text sources for embedded asset references.
    rounds = 2
    for _ in range(rounds):
        allowed_sources = {
            u
            for u in discovered_urls
            if is_allowed_origin(args.url, u, args.include_subdomains, args.all_origins)
        }
        extra = discover_from_text_sources(
            session, args.url, allowed_sources, timeout=args.timeout
        )
        before = len(discovered_urls)
        discovered_urls.update(extra)
        if len(discovered_urls) == before:
            break

    filtered = sorted(
        u
        for u in discovered_urls
        if is_allowed_origin(args.url, u, args.include_subdomains, args.all_origins)
        and (
            is_asset_like(u) or is_downloadable_content_type(response_types.get(u, ""))
        )
    )

    manifest: dict[str, object] = {
        "source_url": args.url,
        "captured_at": int(time.time()),
        "all_origins": args.all_origins,
        "total_discovered": len(discovered_urls),
        "total_candidate_assets": len(filtered),
        "saved_pages": {
            "before_open_html": str(before_html_path.name),
            "after_open_html": str(after_html_path.name),
            "after_open_visible_text": str(after_text_path.name),
        },
        "network_response_types": response_types,
        "assets": [],
    }

    for i, asset_url in enumerate(filtered, start=1):
        result = download_asset(
            session, asset_url, out_root, timeout=args.timeout, retries=args.retries
        )
        manifest["assets"].append(result)
        status = result["status"]
        print(f"[{i}/{len(filtered)}] {status:14} {asset_url}")

    manifest_path = out_root / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print("\nDone.")
    print(f"Saved HTML (before): {before_html_path}")
    print(f"Saved HTML (after): {after_html_path}")
    print(f"Saved visible text (after): {after_text_path}")
    print(f"Saved manifest: {manifest_path}")
    print(f"Assets directory: {out_root}")


if __name__ == "__main__":
    main()
