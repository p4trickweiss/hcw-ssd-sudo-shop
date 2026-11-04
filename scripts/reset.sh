#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
exec node --import tsx scripts/reset.ts
