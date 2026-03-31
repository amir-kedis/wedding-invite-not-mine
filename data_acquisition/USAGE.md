# Asset Scraper Usage

## 1) Install dependencies

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m playwright install chromium
```

## 2) Run scraper

```bash
.venv/bin/python scrape_assets.py \
  --url "https://our.weddingg.co/omar-salma-template" \
  --out "downloaded_assets" \
  --include-subdomains \
  --all-origins
```

## 3) Output

- `downloaded_assets/before_open.html`: page snapshot before opening invitation
- `downloaded_assets/after_open.html`: page snapshot after opening invitation
- `downloaded_assets/after_open_visible_text.txt`: visible text of opened invitation sections
- `downloaded_assets/page.html`: compatibility copy of post-open HTML
- `downloaded_assets/manifest.json`: list of all discovered and downloaded assets
- `downloaded_assets/<domain>/...`: downloaded files

## Notes

- Use only with content you own or have explicit permission to archive.
- "Highest quality" is approximated by selecting the largest candidate from `srcset` and by capturing lazy-loaded resources through interaction + scrolling before download.
- `--all-origins` is recommended when the page serves assets from CDN/storage domains.
