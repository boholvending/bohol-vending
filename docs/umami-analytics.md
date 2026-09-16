# BOHOL Umami analytics

Umami replaces the unfinished Google/Data Studio analytics flow.

## Server plan

- Run Umami on the production server with Docker Compose.
- Store analytics data outside the website deploy folder at `/var/lib/bohol-umami/postgres`.
- Proxy `https://stats.boholvending.com` to `127.0.0.1:3001`.
- Create one website in Umami for `boholvending.com`.
- Copy the Website ID and Share URL into the website environment variables.

## Website variables

```env
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://stats.boholvending.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=67526bd7-f75d-45f3-b748-86d84ac8ab32
NEXT_PUBLIC_UMAMI_SHARE_URL=https://stats.boholvending.com/share/TDZJE9DwE8PFyJe4
```

## Events already marked

- Quote form submit click
- Quote form submitted
- Contact panel open / close
- Chat quick question
- Chat contact send click
- Email, WhatsApp, WeChat, Facebook and YouTube clicks

## Still required

- Install Umami on the server.
- Add DNS for `stats.boholvending.com`.
- Add an HTTPS reverse proxy in CloudPanel or Nginx.
- Rebuild and deploy the website after Share URL changes.
