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
