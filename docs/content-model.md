# Content Model

This site has two public-facing collections:

- `projects/`
- `writing/`

Use the same small set of editorial fields across both collections so filtering and promotion stay predictable.

## Shared Editorial Fields

- `content_type`
  - `projects/`: always `build`
  - `writing/`: `learn` or `reflect`
- `access`
  - `private`: not intended for the public site
  - `bounded`: selectively shareable, but not generally public
  - `public`: safe to surface on the public site
- `tier`
  - `flagship`: cornerstone work or writing
  - `featured`: strong items worth highlighting
  - `standard`: normal published items
  - `archive`: older or lower-priority items that should remain accessible

For now, every content item should include these fields even if the site is not yet enforcing visibility rules automatically.

## Homepage Rule

The homepage is curated and should only show items that match both of these fields:

- `access: public`
- `tier: flagship`

That means homepage visibility is controlled directly in each document's front matter. If an item should disappear from the homepage without becoming private, change `tier` from `flagship` to `featured`, `standard`, or `archive`.

## Recommended Project Front Matter

```yaml
---
title: Example Project
slug: example-project
summary: One clear sentence describing the project.
year: 2026
content_type: build
access: public
tier: standard
tags:
  - design
  - research
image: assets/example.png
links:
  demo: https://example.com
  repo: https://github.com/example/repo
  blog: https://example.com/blog/example-project
  video: https://example.com/video/example-project
---
```

## Recommended Writing Front Matter

```yaml
---
title: Example Essay
slug: example-essay
summary: One clear sentence describing the piece.
date: 2026-03-17
content_type: reflect
access: public
tier: standard
tags:
  - publishing
  - notes
image: assets/example.png
---
```

Notes:

- Keep filenames lowercase and hyphenated, for example `projects/example-project.qmd`.
- Match the `slug` to the filename unless there is a strong reason not to.
- Use `summary` for listing pages and cards.
- Keep `tags` short and stable so they remain usable for future filtering.

## Authoring Conventions

Project pages and writing pages should not be authored the same way.

### Projects

Project pages render with a case-study layout. Put the metadata in front matter, then write the body using sections such as:

- `## Overview`
- `## Context / Problem`
- `## What I Built`
- `## Visuals`
- `## What I Learned`
- `## Related Links`

The page will automatically render:

- a project summary block
- a metadata grid
- a top links block when `links.demo`, `links.repo`, `links.blog`, or `links.video` are present

### Writing

Writing pages render with a lighter reading layout. Keep the body more essay-like and avoid forcing it into a project structure.

The page will automatically render:

- the summary
- a metadata line with `date`, `content_type`, and `tags`
- an optional related block at the bottom if you add `related_project` or `related_writing`

Example related metadata:

```yaml
related_project:
  title: Example Project
  href: /projects/example-project.html
related_writing:
  - title: Another Essay
    href: /writing/another-essay.html
```
