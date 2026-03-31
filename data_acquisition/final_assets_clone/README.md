# Final Clone Assets

This folder contains the final assets needed to reproduce the opened invitation experience.

## Included

- `content/after_open.html`: HTML snapshot after opening invitation
- `content/after_open_visible_text.txt`: rendered invitation text/content sections
- `content/before_open.html`: pre-open gate snapshot
- `assets/our.weddingg.co/*`: first-party CSS/JS/images/video/font/service-worker files
- `assets/external/pub-9531532084584b09aa9929be42cbd776.r2.dev/*`: external hero videos/images used by template variants
- `assets/external/cdn.pixabay.com/*`: optional background music tracks
- `assets/external/fonts.gstatic.com/*`: Google font binaries referenced by runtime CSS

## Bundle Size

- 36 files
- ~42.82 MB

## Notes

- Core visual clone assets are under `assets/our.weddingg.co` plus `content/after_open.html`.
- External folders are included to avoid broken media/fonts when recreating the page offline.
