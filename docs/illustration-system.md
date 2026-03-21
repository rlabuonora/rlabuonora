# Illustration System

This site should read as one illustration family, not a collection of unrelated generated images.

The guiding model is restrained editorial illustration:

- black or near-black line work
- off-white paper field
- clear safe area around the subject
- quiet optical centering
- low visual noise
- no decorative effects that compete with typography

The system uses two tracks:

1. normalized raster illustrations for posts and image-heavy references
2. simplified emblem treatment for recurring site marks

## Illustration Specification

### Shared Rules

- Master raster canvas: `1024 x 1024`
- Shared paper tone: `#F7F3EC`
- Stroke color: near-black rather than pure black
- Saturation: effectively monochrome
- Contrast: mild normalization only
- Visual center: optically centered, not just mathematically centered
- Outer safe area: preserve roughly `10%` to `16%` empty canvas around the main form

### Target Scale

- Section emblems should occupy roughly `60%` to `76%` of the square canvas
- Post illustrations should occupy roughly `68%` to `82%` of the square canvas
- Wide hero or skyline illustrations may break the square format, but must still preserve a generous top and side margin when rendered on the page

### Line Density And Shading

- Use light to moderate engraving density
- Keep one dominant line language across the set
- Allow hatching only when it supports form and does not darken the image into a visual block
- Prefer open line work over heavy fills

### Allowed Features

- thin line drawing
- restrained engraving or hatching
- subtle baseline or ground indication when it helps the object sit in space
- architectural or instrument-like precision

### Disallowed Features

- mismatched paper colors
- hard drop shadows
- dense vignette backgrounds
- glossy effects
- painterly fills
- aggressive texture overlays
- overly dark local shading that overpowers nearby text
- subject crops that touch the edge without an intentional reason

## Usage Rules

### Logo Or Skyline Usage

- Use wide line illustrations such as the Montevideo skyline
- Do not place them in a heavy framed card
- Keep them horizontally centered with calm surrounding space
- Preserve their thin baseline and avoid overscaling them on mobile

### Section Emblems

- Render inside a shared square paper field
- Use consistent padding and border treatment
- Use consistent maximum visual size regardless of the underlying source crop
- Keep recurring emblems simpler and cleaner than post illustrations

### Post Illustrations

- Render inside the same paper field system as emblems
- Allow slightly larger subject scale than emblems
- Keep them secondary to the headline and summary
- Prefer one illustration per post context rather than mixing multiple styles

## Current Inconsistencies

The current asset set had several inconsistencies before normalization:

- raw assets and processed assets were mixed in production templates
- the posts index hero used a raw wide library image while the homepage used normalized emblems
- the featured posts card used a hard-coded raw skull illustration instead of the post front matter image
- some front matter pointed to missing assets such as `assets/image.png` and `assets/mvd.png`
- recurring emblems and post illustrations were rendered with different wrappers, padding, and background treatment
- page-level illustration margins differed between the homepage, posts index, projects index, and featured cards

## Normalization Plan

1. Use processed raster assets in production templates by default.
2. Normalize any newly introduced raw illustration before it is used publicly.
3. Keep one shared paper tone and one shared wrapper treatment across cards and section art.
4. Use front matter image fields consistently instead of hard-coded one-off art in templates.
5. Reserve skyline-style art for wide hero contexts only.
6. Continue simplifying the most repeated emblems over time if they remain visually noisier than the rest of the family.

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

## Manifest Workflow

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

The script crops the source, keys out the near-white original background, and composites the drawing onto the shared paper canvas.

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
5. Set `fit` so the subject lands inside the target scale range for its usage type.
6. Run `./scripts/normalize_illustrations.sh`.
7. Compare the processed output against the other illustrations. Adjust crop or fit until the object sits with similar visual weight and safe area.

If the image is for a post and not a recurring site emblem, stop there. Keep it as a normalized raster asset.

## Recommendation

- Use normalized raster assets for all current site illustrations in production.
- Treat the recurring emblems as a controlled subset with tighter scale and cleaner framing.
- Only introduce SVG redraws later if a repeated mark still feels visually noisier than the rest of the set after normalization.
