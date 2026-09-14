# Rafael La Buonora

Personal website built with Quarto. Netlify deploys the `master` branch using
`netlify.toml`, installs Quarto 1.9.38, and publishes `_site/`.

## Local preview

Install Quarto 1.9.38 and run `quarto preview`. To build without a preview server,
run `bash scripts/netlify-build.sh`. Stop preview before running a separate render.

Posts, projects, and courses are authored in `posts/`, `proyectos/`, and `cursos/`.
Unpublished material lives in `drafts/`, excluded from rendering. Historical
analyses use precomputed outputs; R and Python are not required for deployment.

`_redirects` preserves the former Hugo article URLs. The Hugo sources remain in
Git history before the migration commit. See `docs/content-model.md` for authoring
conventions and `docs/post-migration.md` for the post migration inventory.

## Canonical repository and publishing

- Repository: https://github.com/rlabuonora/blog_2
- Local checkout: `/home/rlabuonora/code/personal-site`
- Production branch: `master`
- Production site: https://www.rlabuonora.com
- Netlify build: `bash scripts/netlify-build.sh`; publish directory: `_site/`.

Edit only this repository. Run `XDG_CACHE_HOME=/tmp/quarto-cache bash scripts/netlify-build.sh`
before publishing, inspect the rendered pages, then commit and push to `origin master`.
A push is not proof of publication: verify the Netlify deploy and the changed live page.
For larger changes, use a pull request and review its Netlify Deploy Preview when available.

## Preserved history

The former `rlabuonora/rlabuonora` site development repository is archived.
Its complete `main` history ending at `3a7989e46a68167412c82d82567f85528773f40d`
is preserved here as branch `archive/rlabuonora-main` and tag
`archive/rlabuonora-2026-09-14`. No existing history was rewritten.
Use `git log archive/rlabuonora-main` to inspect it.

Consolidation retained this repository's Netlify configuration, redirects, favicon,
resources, metadata and whitespace cleanup. It brought over the missing design
prompts and Makefile, later home/About copy, post summaries and archive-title styling.
The Durmiendo mejor post and its assets were already transferred in `8cbc82c`.
