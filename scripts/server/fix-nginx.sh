#!/usr/bin/env bash
set -euo pipefail

DOMAIN="boholvending.com"
WWW_DOMAIN="www.boholvending.com"
SITEMAP_URL="https://${WWW_DOMAIN}/sitemap.xml"
CONF_LINK="/etc/nginx/sites-enabled/${DOMAIN}.conf"
OLD_CONF_LINK="/etc/nginx/sites-enabled/boholvending"

require_root() {
  if [ "$(id -u)" -ne 0 ]; then
    echo "Please run with sudo:"
    echo "sudo bash scripts/server/fix-nginx.sh"
    exit 1
  fi
}

require_file() {
  if [ ! -e "$1" ]; then
    echo "Missing Nginx config: $1"
    exit 1
  fi
}

backup_config() {
  BACKUP_DIR="$(mktemp -d /etc/nginx/bohol-nginx-backup-XXXXXX)"
  cp -p "$REAL_CONF" "${BACKUP_DIR}/boholvending.com.conf"

  if [ -e "$OLD_CONF_LINK" ]; then
    mv "$OLD_CONF_LINK" "${BACKUP_DIR}/boholvending.disabled"
  fi

  echo "$BACKUP_DIR"
}

restore_config() {
  cp -p "${BACKUP_DIR}/boholvending.com.conf" "$REAL_CONF"

  if [ -e "${BACKUP_DIR}/boholvending.disabled" ] && [ ! -e "$OLD_CONF_LINK" ]; then
    mv "${BACKUP_DIR}/boholvending.disabled" "$OLD_CONF_LINK"
  fi

  nginx -t >/dev/null && systemctl reload nginx
}

patch_config() {
  perl -0pi -e '
    s/server_name\s+www\.boholvending\.com\s*;/server_name boholvending.com;/g;
    s/server_name\s+boholvending\.com\s+www1\.boholvending\.com\s*;/server_name www.boholvending.com;/g;
    s/server_name\s+boholvending\.com\s+www\.boholvending\.com\s*;/server_name www.boholvending.com;/g;
    s@return\s+301\s+https://boholvending\.com\$request_uri\s*;@return 301 https://www.boholvending.com$request_uri;@g;
  ' "$REAL_CONF"
}

verify_nginx() {
  nginx -t
  systemctl reload nginx
}

verify_sitemap() {
  local headers
  headers="$(curl -fsSIL "$SITEMAP_URL")"

  echo "$headers" | grep -qiE '^HTTP/[0-9.]+ 200' || {
    echo "Sitemap did not return 200:"
    echo "$headers"
    exit 1
  }

  echo "$headers" | grep -qiE '^content-type: *(application/xml|text/xml)' || {
    echo "Sitemap Content-Type is not XML:"
    echo "$headers"
    exit 1
  }

  curl -fsSL "$SITEMAP_URL" | grep -q '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' || {
    echo "Sitemap body is not a standard XML sitemap."
    exit 1
  }
}

verify_redirect() {
  local location
  location="$(curl -fsSI "https://${DOMAIN}/sitemap.xml" | awk 'tolower($1) == "location:" {print $2}' | tr -d '\r')"

  if [ "$location" != "$SITEMAP_URL" ]; then
    echo "Root domain redirect is wrong: ${location:-none}"
    exit 1
  fi
}

main() {
  require_root
  require_file "$CONF_LINK"

  REAL_CONF="$(readlink -f "$CONF_LINK")"
  BACKUP_DIR="$(backup_config)"

  echo "Backup created: $BACKUP_DIR"

  trap 'echo "Failed. Restoring backup..."; restore_config' ERR

  patch_config
  verify_nginx
  sleep 2
  verify_sitemap
  verify_redirect

  trap - ERR

  echo "OK: Nginx domain rules are fixed."
  echo "OK: ${SITEMAP_URL} returns 200 XML."
  echo "Backup kept at: $BACKUP_DIR"
}

main "$@"
