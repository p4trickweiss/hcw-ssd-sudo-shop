#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
docker compose up -d --wait db
docker compose run --rm --no-deps app node --import tsx scripts/reset.ts
