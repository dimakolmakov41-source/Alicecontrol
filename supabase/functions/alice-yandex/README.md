# Supabase Edge Function: alice-yandex

This function is a narrow proxy to the official Yandex Smart Home API.

## Deploy
Deploy as function name `alice-yandex` to a Supabase project. It has no Yandex client secret and does not store OAuth tokens. The browser sends the user's Yandex OAuth token in `x-yandex-token`; never put that token in source control or logs.

## Request
POST/GET `https://<project-ref>.supabase.co/functions/v1/alice-yandex?resource=user/info`

Header: `x-yandex-token: <user OAuth token>`

Supported resources:
- GET `user/info`
- GET `devices/{device_id}`
- GET `groups/{group_id}`
- POST `devices/actions`
- POST `groups/{group_id}/actions`
- POST `scenarios/{scenario_id}/actions`

The function deliberately restricts resources and CORS to the published ALICE CONTROL site. Supabase gateway JWT verification is disabled because Yandex OAuth is the credential; the function validates its presence and forwards it to Yandex. Treat the token as a password and keep it only in memory in the browser.

This proxy does not change the Station's firmware or system voice. It can only expose capabilities Yandex Smart Home API supports for the authorized account.
