#!/bin/sh
set -eu
node --import tsx scripts/init.ts
exec node build
