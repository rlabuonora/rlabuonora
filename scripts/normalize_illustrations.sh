#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="${1:-$ROOT_DIR/assets/illustrations-manifest.txt}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but not installed." >&2
  exit 1
fi

if [[ ! -f "$MANIFEST" ]]; then
  echo "Manifest not found: $MANIFEST" >&2
  exit 1
fi

normalize_one() {
  local source="$1"
  local target="$2"
  local canvas="$3"
  local bg="$4"
  local crop_x="$5"
  local crop_y="$6"
  local crop_w="$7"
  local crop_h="$8"
  local fit="$9"
  local contrast="${10}"
  local brightness="${11}"
  local black_point="${12}"

  mkdir -p "$(dirname "$target")"

  ffmpeg -loglevel error -y \
    -i "$source" \
    -f lavfi -i "color=c=${bg}:s=${canvas}x${canvas}" \
    -filter_complex "[0:v]crop=${crop_w}:${crop_h}:${crop_x}:${crop_y},format=rgba,colorkey=0xF8F6F0:0.10:0.03,eq=contrast=${contrast}:brightness=${brightness}:saturation=0,colorlevels=rimin=${black_point}:gimin=${black_point}:bimin=${black_point},scale=${fit}:${fit}:force_original_aspect_ratio=decrease[fg];[1:v][fg]overlay=(W-w)/2:(H-h)/2:format=auto,setsar=1" \
    -frames:v 1 -update 1 "$target"
  echo "normalized: $target"
}

while IFS='|' read -r source target canvas bg crop_x crop_y crop_w crop_h fit contrast brightness black_point; do
  [[ -z "${source}" ]] && continue
  [[ "${source:0:1}" == "#" ]] && continue
  normalize_one \
    "$ROOT_DIR/$source" \
    "$ROOT_DIR/$target" \
    "$canvas" \
    "$bg" \
    "$crop_x" \
    "$crop_y" \
    "$crop_w" \
    "$crop_h" \
    "$fit" \
    "$contrast" \
    "$brightness" \
    "$black_point"
done < "$MANIFEST"
