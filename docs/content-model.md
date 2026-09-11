# Publishing the site

The public site has three collections: `proyectos/`, `posts/`, and `cursos/`.
Write content in Quarto (`.qmd`) and keep filenames stable so existing URLs continue working.

## Metadata

Use `title`, `summary`, `lang` (`es` or `en`), and `tags` on collection items.
Projects use `year` and `content_type: build`; notes and courses use `date` and
`content_type: learn` or `reflect`. The content type selects the detail layout;
it is not displayed to readers.

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

Projects show their summary, year, language, tags, and optional `links` (`demo`,
`repo`, `blog`, `video`). Add real screenshots in the body when useful. Internal
access/tier fields and image filenames are not displayed.

Notes and courses use a reading layout with a summary, date, language, and tags.
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

No deployment provider or automated deployment workflow is configured in this
repository. Configure the intended host to serve `_site/` after rendering; confirm
the production destination before publishing.

The current visual direction is complete for this release. New illustration work,
extra template families, CSS reorganization, and publishing access rules are deferred.
