#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "https://our.weddingg.co/omar-salma-template"
OUT = Path("debug_open")
OUT.mkdir(parents=True, exist_ok=True)


def main() -> None:
    requests_log = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 2600})
        page = context.new_page()

        def on_response(resp):
            try:
                ct = (resp.headers or {}).get("content-type", "")
            except Exception:
                ct = ""
            if any(
                x in ct
                for x in [
                    "json",
                    "javascript",
                    "text",
                    "image",
                    "video",
                    "audio",
                    "font",
                ]
            ):
                requests_log.append(
                    {
                        "url": resp.url,
                        "status": resp.status,
                        "content_type": ct,
                        "resource_type": resp.request.resource_type,
                    }
                )

        page.on("response", on_response)
        page.goto(URL, wait_until="domcontentloaded", timeout=120000)
        page.wait_for_timeout(2500)

        before_html = page.content()
        (OUT / "before_open.html").write_text(before_html, encoding="utf-8")

        clicked = False
        for candidate in ["tap to open", "open invitation", "open"]:
            loc = page.get_by_text(re.compile(candidate, re.IGNORECASE)).first
            if loc.count() > 0:
                try:
                    loc.click(timeout=3000)
                    clicked = True
                    break
                except Exception:
                    pass

        # Fallback: click center if overlay intercepts.
        if not clicked:
            page.mouse.click(720, 600)

        # Let animations/data loading complete.
        page.wait_for_timeout(4500)

        # Scroll full page to force lazy sections to render.
        page.evaluate(
            """
            async () => {
              const step = 700;
              const delay = ms => new Promise(r => setTimeout(r, ms));
              for (let y = 0; y < document.body.scrollHeight + 1200; y += step) {
                window.scrollTo(0, y);
                await delay(140);
              }
              window.scrollTo(0, 0);
            }
            """
        )
        page.wait_for_timeout(1200)

        page.screenshot(path=str(OUT / "after_open_full.png"), full_page=True)
        after_html = page.content()
        (OUT / "after_open.html").write_text(after_html, encoding="utf-8")

        visible_text = page.evaluate(
            """
            () => (document.body?.innerText || '')
            """
        )
        (OUT / "after_open_visible_text.txt").write_text(visible_text, encoding="utf-8")

        # Save performance resource entries.
        perf = page.evaluate(
            "() => performance.getEntriesByType('resource').map(r => ({name:r.name, type:r.initiatorType, dur:r.duration}))"
        )
        (OUT / "performance_resources.json").write_text(
            json.dumps(perf, indent=2), encoding="utf-8"
        )

        browser.close()

    # Deduplicate requests by URL keeping first occurrence.
    dedup = {}
    for r in requests_log:
        dedup.setdefault(r["url"], r)

    (OUT / "responses.json").write_text(
        json.dumps(list(dedup.values()), indent=2), encoding="utf-8"
    )
    print(f"Saved debug artifacts to: {OUT.resolve()}")
    print(f"Requests captured: {len(dedup)}")


if __name__ == "__main__":
    main()
