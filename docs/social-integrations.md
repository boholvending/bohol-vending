# BOHOL social integrations

The admin route `/bohol-control-7e9c2f/social` only reports a platform as configured when its required server secrets are present. Never commit tokens to Git or expose them through `NEXT_PUBLIC_*` variables.

## WhatsApp Business Cloud API

Add these values to the production private environment file loaded by PM2:

```dotenv
META_APP_ID='...'
META_APP_SECRET='...'
META_GRAPH_API_VERSION='v24.0'
WHATSAPP_WABA_ID='...'
WHATSAPP_PHONE_NUMBER_ID='...'
WHATSAPP_ACCESS_TOKEN='...'
WHATSAPP_VERIFY_TOKEN='a-long-random-value'
```

Configure Meta's Webhook callback URL as:

```text
https://www.boholvending.com/api/webhooks/whatsapp
```

Subscribe the WhatsApp Business Account to message events. The GET challenge validates `WHATSAPP_VERIFY_TOKEN`; POST deliveries require a valid `X-Hub-Signature-256` generated with `META_APP_SECRET`.

Messages are stored outside the repository at `~/.local/share/bohol-vending/whatsapp-messages.jsonl`. Override with `BOHOL_WHATSAPP_MESSAGES_FILE`. This is the server storage file; configure an independent backup policy if retention beyond the live file is required. The website does not import phone-app history from before the API connection.

## Other platform status variables

- Facebook: `META_APP_ID`, `META_APP_SECRET`, `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_ACCESS_TOKEN`
- Instagram: Meta credentials plus `INSTAGRAM_BUSINESS_ACCOUNT_ID` and `FACEBOOK_PAGE_ACCESS_TOKEN`
- LinkedIn: `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_ACCESS_TOKEN`
- YouTube: `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`
- TikTok: `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_ACCESS_TOKEN`
- X: `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_ACCESS_TOKEN`

The first release exposes truthful configuration state and the WhatsApp inbox/reply workflow. Automated publishing for each social network still requires its official app review and OAuth permission approval.
