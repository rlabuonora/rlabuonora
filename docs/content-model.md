# Publishing the site

The public site has three collections: `proyectos/`, `posts/`, and `cursos/`.
Write content in Quarto (`.qmd`) and keep filenames stable so existing URLs continue working.

## Metadata

Use `title`, `summary`, `lang` (`es` or `en`), and `tags` on collection items.
Projects use `year` and `content_type: build`; notes and courses use `date` and
`content_type: learn` or `reflect`. All three use the same reading layout;
the content type is not displayed to readers.

All publishable items currently have `access: public`. This field filters listings,
not the rendered output: it is not an access-control mechanism. Keep unpublished
material under `drafts/`, which is explicitly excluded from rendering. Private/bounded publishing is deferred.

## Listings and homepage

Each collection index lists every public item, newest first. Projects are sorted
by year; notes and courses by date. There are no separate project archive tiers.

The homepage shows up to three public projects marked `tier: flagship`, the three
latest public notes, and public courses marked `tier: flagship`. Use
`tier: standard` for projects and courses that belong only in their collection.
Other historical tier values can remain in metadata but have no special index layout.

## Detail pages

Projects, notes, and courses use a reading layout with a summary, date (or project
year), language, and tags. Put project links in the body, under an
`Enlaces relacionados` heading at the end when appropriate. Add real screenshots
in the body when useful. Internal access/tier fields and image filenames are not displayed.
Keep existing English articles in English and Spanish articles in Spanish.
The site navigation is Spanish.

## Release check

Run `quarto render`; the deployable output is `_site/`. If the local environment
cannot write the default cache, use `XDG_CACHE_HOME=/tmp/quarto-cache quarto render`.

Inspect home, collection indexes, About, and representative detail pages at desktop
and mobile widths. Check navigation, local links, screenshots, and text overflow.
With Node and the package dependencies installed, capture these pages using:

```sh
node scripts/capture-design-screenshots.mjs --include-detail-pages
```

Netlify builds `master` using `netlify.toml` and `scripts/netlify-build.sh`,
then serves `_site/` at `https://rlabuonora.com`. Quarto is pinned to 1.9.38.

The current visual direction is complete for this release. New illustration work,
extra template families, CSS reorganization, and publishing access rules are deferred.
