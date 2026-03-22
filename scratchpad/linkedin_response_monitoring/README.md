# LinkedIn Post Monitor

Monitors a list of LinkedIn personal profiles for new posts. For each new post:
1. Fetches post data via **Proxycurl API**
2. Generates an **AI summary** via Claude (Anthropic)
3. Sends a **Telegram** message and/or **email** alert

Runs on a schedule via Docker + Ofelia cron scheduler on your VPS.

---

## Setup

### 1. Clone / copy files to your VPS
```bash
scp -r linkedin-monitor/ user@your-vps:/opt/linkedin-monitor
cd /opt/linkedin-monitor
```

### 2. Configure environment
```bash
cp .env.example .env
nano .env   # Fill in all API keys and credentials
```

**Required values:**
| Variable | Where to get it |
|---|---|
| `PROXYCURL_API_KEY` | [nubela.co/proxycurl](https://nubela.co/proxycurl) → Dashboard |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `TELEGRAM_BOT_TOKEN` | Chat with [@BotFather](https://t.me/botfather) on Telegram → `/newbot` |
| `TELEGRAM_CHAT_ID` | Chat with [@userinfobot](https://t.me/userinfobot) to get your ID |
| `SMTP_USER` / `SMTP_PASSWORD` | For Gmail: use an [App Password](https://myaccount.google.com/apppasswords) |

### 3. Add profiles to monitor
Edit `profiles.json`:
```json
[
  {
    "name": "Satya Nadella",
    "linkedin_url": "https://www.linkedin.com/in/satyanadella",
    "notify_email": true,
    "notify_telegram": true
  }
]
```
Find profile URLs by visiting someone's LinkedIn profile — copy the URL from your browser.

### 4. Build and start
```bash
docker compose up -d --build
```

### 5. Test a manual run
```bash
docker compose run --rm monitor
```
You should see logs and receive a Telegram + email for any new posts found.

---

## Schedule

The default schedule in `docker-compose.yml` runs **every 4 hours**.  
Edit the cron expression in the `ofelia.job-run.monitor.schedule` label:

```yaml
# Every 4 hours
ofelia.job-run.monitor.schedule: "0 */4 * * *"

# Every 2 hours
ofelia.job-run.monitor.schedule: "0 */2 * * *"

# Every day at 8am
ofelia.job-run.monitor.schedule: "0 8 * * *"
```

After editing, restart:
```bash
docker compose down && docker compose up -d --build
```

---

## Proxycurl API costs

Proxycurl charges per API call. The Posts endpoint typically costs **~3 credits per profile per run**.  
At 4-hour intervals with 5 profiles: ~3 × 5 × 6 runs/day = ~90 credits/day.  
Check [Proxycurl pricing](https://nubela.co/proxycurl/pricing) for current rates.

---

## File structure

```
linkedin-monitor/
├── main.py           # Orchestrator — runs the full pipeline
├── linkedin.py       # Proxycurl API client
├── summarizer.py     # Claude AI summary generation
├── notifications.py  # Telegram + Email sender
├── database.py       # SQLite deduplication store
├── profiles.json     # List of profiles to monitor (edit this)
├── .env              # Your secrets (never commit this)
├── .env.example      # Template
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## Troubleshooting

**No posts returned** — verify the LinkedIn URL is correct and public. Proxycurl can only access public profiles.

**Telegram message not sent** — confirm the bot has been started (send `/start` to it first). Check `TELEGRAM_CHAT_ID` is your personal chat ID, not the bot's.

**Gmail auth failure** — ensure you're using an App Password, not your account password. 2FA must be enabled on the Google account.

**Duplicate notifications** — the SQLite database in `monitor_data` volume deduplicates by post URL. If you need to reset it: `docker volume rm linkedin-monitor_monitor_data`
