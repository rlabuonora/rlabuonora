# Illustration System

This site uses a practical two-track illustration system:

1. Raster normalization for generated illustrations
2. SVG cleanup for the most important recurring emblems

## What Can Be Automated

These parts can be made consistent with a script:

- square export size
- rebuilt background color
- padding target
- centering after a defined crop
- mild contrast and black-point normalization
- folder structure and naming

## What Cannot Be Fully Automated

These parts still require judgment:

- whether a drawing is too detailed for emblem use
- whether line density feels too busy next to another illustration
- simplifying generated raster art into a clean icon
- correcting awkward perspective or uneven stroke behavior

That is why this workflow treats recurring emblems differently from general post illustrations.

## Folder Structure

```text
assets/
  raw/
    emblems/
    posts/
  processed/
    raster/
      emblems/
      posts/
```

- `raw/` stores source files you do not edit or overwrite.
- `processed/` stores normalized outputs used by the site once approved.

## Current Manifest Workflow

The normalization presets live in:

- `assets/illustrations-manifest.txt`

Each line defines:

- source file
- processed output file
- canvas size
- background color
- crop box
- fit size inside the square canvas
- contrast
- brightness
- black-point lift

The script crops the source, keys out the near-white original background, and composites the drawing onto one shared off-white canvas.

The script lives in:

- `scripts/normalize_illustrations.sh`

Run it with:

```bash
./scripts/normalize_illustrations.sh
```

## How To Add A New Illustration

1. Put the new source image in `assets/raw/emblems/` or `assets/raw/posts/`.
2. Copy one line in `assets/illustrations-manifest.txt` and update the filenames.
3. Start with:
   - `canvas`: `1024`
   - `bg`: `0xF7F3EC`
   - `contrast`: `1.07`
   - `brightness`: `0.010`
   - `black_point`: `0.030`
4. Set a crop rectangle that trims most of the excess whitespace.
5. Set `fit` so the subject feels similar in visual weight to the other processed assets.
6. Run `./scripts/normalize_illustrations.sh`.
7. Compare the processed output against the other illustrations. Only adjust crop or fit if it still looks off.

If the image is for a post and not a recurring site emblem, stop there. Keep it as a normalized raster asset.

## SVG Emblem Plan

These should become simplified SVG assets instead of staying generated rasters:

### Drafting Compass

- Redraw as a single clean silhouette-plus-line icon
- Keep only the main legs, hinge, crossbar, and needle ends
- Remove noisy shading and inner micro-detail
- Use one stroke weight throughout

### Palacio Salvo

- Rebuild as a skyline or facade mark, not a detailed architectural drawing
- Keep the central tower silhouette and a few landmark massing cues
- Remove window-by-window detail
- Prepare both a horizontal and compact mark

### Magnifying Glass

- Redraw as a clean circular lens and handle
- Remove construction geometry and sketch traces
- Keep one or two inner detail lines at most

### Envelope

- Create this fresh as SVG rather than generating it from prompts
- Use a rectangle, flap line, and optional inner fold line
- Keep it extremely plain so it matches the emblem family

## SVG Style Rules

When these SVGs are made, keep them consistent:

- square artboard for standalone marks: `256 x 256`
- horizontal emblem variant only when needed
- stroke color: near-black, not pure black
- one primary stroke weight across the full emblem family
- rounded joins and caps unless the emblem clearly needs sharp corners
- no shading, texture, or sketch noise

## Recommendation

- Use normalized raster assets for post illustrations.
- Use simplified SVGs for recurring site emblems and navigation marks.
- Do not try to force every generated illustration into SVG. Only convert the assets that repeat often enough to justify cleanup.
