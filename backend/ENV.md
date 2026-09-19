# Backend environment variables

Environment variables for the Spring Boot backend deployed on Render.

## Database (required for location access requests)

| Variable | Required | Description |
|----------|----------|-------------|
| `SPRING_DATASOURCE_URL` | Yes | JDBC PostgreSQL URL, e.g. `jdbc:postgresql://host:5432/dbname` |
| `SPRING_DATASOURCE_USERNAME` | Yes | PostgreSQL username |
| `SPRING_DATASOURCE_PASSWORD` | Yes | PostgreSQL password |

Render's raw `DATABASE_URL` uses the `postgres://` format. Convert it to JDBC or set `SPRING_DATASOURCE_URL` explicitly.

## Location access admin (required)

| Variable | Required | Description |
|----------|----------|-------------|
| `LOCATION_ADMIN_API_KEY` | Yes | Secret key for admin REST endpoints (`X-Admin-Api-Key`) |
| `LOCATION_ACCESS_ADMIN_PAGE_URL` | Yes | Admin review page URL for owner notification emails, e.g. `https://your-site/admin/location-requests` |
| `LOCATION_ACCESS_REQUESTER_PAGE_URL` | Yes | Requester access page base URL used in approval emails, e.g. `https://your-site/location-access` |

## Location access notifications via Resend (required)

Location request and approval emails use the [Resend HTTPS API](https://resend.com/docs/api-reference/emails/send-email). They do **not** use Gmail SMTP.

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | Resend API key (`re_...`) |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address/domain in Resend, e.g. `Portfolio <notifications@yourdomain.com>` |
| `LOCATION_ACCESS_NOTIFICATION_RECIPIENT` | No | Owner inbox for new request alerts. Defaults to `CONTACT_RECIPIENT` |

## Optional location access settings

| Variable | Default | Description |
|----------|---------|-------------|
| `CONTACT_RECIPIENT` | `ileanatemer@gmail.com` | Fallback recipient when `LOCATION_ACCESS_NOTIFICATION_RECIPIENT` is unset |
| `LOCATION_ACCESS_SUBMIT_RATE_LIMIT` | `5` | Max request submissions per IP per minute |
| `LOCATION_ACCESS_VALIDATE_RATE_LIMIT` | `30` | Max token validations per IP per minute |

## Contact form (still uses Spring Mail / Gmail SMTP)

The contact form is separate from location access notifications.

| Variable | Required | Description |
|----------|----------|-------------|
| `SPRING_MAIL_USERNAME` | For contact form | Gmail address |
| `SPRING_MAIL_PASSWORD` | For contact form | Gmail app password |
| `CONTACT_RECIPIENT` | No | Contact form recipient |

## Render checklist

Set at minimum:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...

LOCATION_ADMIN_API_KEY=...
LOCATION_ACCESS_ADMIN_PAGE_URL=https://your-frontend/admin/location-requests
LOCATION_ACCESS_REQUESTER_PAGE_URL=https://your-frontend/location-access

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Portfolio <notifications@yourdomain.com>
LOCATION_ACCESS_NOTIFICATION_RECIPIENT=you@gmail.com
```

## Resend setup

1. Create a Resend account and generate an API key.
2. Verify a domain or use Resend's test sender while developing.
3. Set `RESEND_FROM_EMAIL` to a sender Resend accepts for your account.
4. Ensure the API key is stored only on Render (never in frontend code).

Owner notification emails include:

- requester name
- requester email
- optional message
- timestamp
- admin review link (`LOCATION_ACCESS_ADMIN_PAGE_URL?requestId=...`)

The admin link does **not** auto-approve requests.
