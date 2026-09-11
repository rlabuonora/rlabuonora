#!/usr/bin/env bash
set -euo pipefail
quarto_version="${QUARTO_VERSION:-1.9.38}"
if command -v quarto >/dev/null && [[ "$(quarto --version)" == "$quarto_version" ]]; then
  quarto render
else
  quarto_dir="$(mktemp -d)"
  trap 'rm -rf "$quarto_dir"' EXIT
  curl --fail --location --retry 3 \
    "https://github.com/quarto-dev/quarto-cli/releases/download/v${quarto_version}/quarto-${quarto_version}-linux-amd64.tar.gz" \
    --output "$quarto_dir/quarto.tar.gz"
  tar -xzf "$quarto_dir/quarto.tar.gz" -C "$quarto_dir"
  "$quarto_dir/quarto-${quarto_version}/bin/quarto" render
fi
