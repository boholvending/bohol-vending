#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/bohol-vending}"
cd "$APP_DIR"

git fetch origin main
git checkout main
git reset --hard origin/main
npm ci --omit=dev
npm run build
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
echo "BOHOL deployed: $(git rev-parse --short HEAD)"
