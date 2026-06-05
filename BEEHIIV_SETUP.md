# Beehiiv Email Capture Setup

The site captures emails via `/api/subscribe` (Vercel serverless function) which forwards to Beehiiv. Until you set the env vars below, emails will be logged to Vercel function logs but not saved anywhere. The UX will still show "Subscribed" to the user.

## One-time setup (15 min)

### 1. Create a Beehiiv publication
1. Go to [beehiiv.com](https://beehiiv.com) → Sign up (free up to 2,500 subs)
2. Create a new publication called "Mumbai Tech Events"
3. Set from name and reply-to email
4. Write a one-time welcome email (see template below)

### 2. Get your API credentials
1. Beehiiv dashboard → **Settings → Integrations → API**
2. Create a new API key (name it "Mumbai Events Site")
3. Copy the API key (starts with `BEEHIIV_*`)
4. Note your **Publication ID** (visible in URL: `app.beehiiv.com/publications/{pub_id}`) — starts with `pub_`

### 3. Add env vars to Vercel
1. [Vercel Dashboard](https://vercel.com) → mumbai-events project → **Settings → Environment Variables**
2. Add two variables:
   - `BEEHIIV_API_KEY` = your API key
   - `BEEHIIV_PUBLICATION_ID` = your `pub_...` ID
3. Apply to: **Production, Preview, Development**
4. Redeploy (push any commit, or trigger redeploy from dashboard)

### 4. Verify
1. Go to live site, submit an email in the Header form
2. Check Beehiiv dashboard → **Subscribers** — should appear within 10 seconds
3. Check browser DevTools Network tab → POST to `/api/subscribe` should return 200

## Subscription source tracking

Each form passes a `source` field so you can segment subscribers in Beehiiv:

| Source | Where |
|--------|-------|
| `header` | Homepage hero |
| `footer` | Footer form |
| `tweet-modal` | Post-navigation support modal |
| `calendar-modal` | Calendar date-click popup |
| `event-detail:<slug>` | Specific event page "Notify me" |

## Welcome email template

```
Subject: You're in! — Mumbai Tech Events

Hey,

Thanks for subscribing to the Mumbai Tech Events.

You'll get a weekly digest of tech events in Mumbai — hackathons, conferences, meetups, startup events — curated by @sagarjethi.

If you're in town for YC Startup School, AWS Summit, or any of the 38+ events in April 15–26, here's the full guide:
https://mumbai-events.sagarjethi.com

See you at the events,
Sagar
```

## Weekly digest cadence
- Send every Monday morning (India time)
- Subject line: "X events in Mumbai this week"
- Content: next 7 days from events.js
- CTA: link to https://mumbai-events.sagarjethi.com

## Sending event reminders (advanced)

Subscribers tagged with a specific event category (via the "Notify me" button) have a `custom_fields.interest` value set. You can use Beehiiv's segment/automation features to send reminders based on this tag.

For a quick win: manually send "Don't miss tomorrow's events" emails via Beehiiv dashboard on Apr 14, 17, 21, 25 (highest-density event days).
