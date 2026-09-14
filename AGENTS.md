# Personal site

This is the sole active site repository: `https://github.com/rlabuonora/blog_2`.
The local checkout is `/home/rlabuonora/code/personal-site`.
Netlify deploys `master` to `https://www.rlabuonora.com` using `netlify.toml`,
`bash scripts/netlify-build.sh`, Quarto 1.9.38 and output directory `_site/`.

Before committing or publishing, check `git remote -v` and `git branch --show-current`.
Use this repository for all site changes; the archived `rlabuonora/rlabuonora`
repository and `archive/rlabuonora-main` branch are historical references only.
Keep the archive branch and `archive/rlabuonora-2026-09-14` tag intact.

Follow `docs/content-model.md`. Preserve `_redirects`, the production URL and
Netlify settings. Build with `XDG_CACHE_HOME=/tmp/quarto-cache bash scripts/netlify-build.sh`
and verify affected pages and assets before publishing. For larger changes, use
pull requests and inspect Netlify Deploy Previews when available. After a production
push, verify deployment completion and live content; report pending deployment honestly.
