# Personal site

This is the sole active site repository: `https://github.com/rlabuonora/rlabuonora`.
It was renamed from `blog_2`; the local checkout is `/Users/rafa/Desktop/code/blog_2`.
Netlify deploys `master` to `https://www.rlabuonora.com` using `netlify.toml`,
`bash scripts/netlify-build.sh`, Quarto 1.9.38 and output directory `_site/`.

Before committing or publishing, check `git remote -v` and `git branch --show-current`.
Use this repository for all site changes. The former development repository was
deleted before this repository took its name; `archive/rlabuonora-main` is historical only.
Keep the archive branch and `archive/rlabuonora-2026-09-14` tag intact.

Follow `docs/content-model.md`. Preserve `_redirects`, the production URL and
Netlify settings. Build with `XDG_CACHE_HOME=/tmp/quarto-cache bash scripts/netlify-build.sh`
and verify affected pages and assets before publishing. For larger changes, use
pull requests and inspect Netlify Deploy Previews when available. After a production
push, verify deployment completion and live content; report pending deployment honestly.
