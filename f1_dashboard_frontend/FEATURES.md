# F1 Fan Dashboard - Features

This React app provides:
- Live F1 race schedule using Ergast API
- Driver and Constructor standings
- Countdown timer with animated progress ring to next race
- Track map visualization (animated car on race day)
- Fan chatroom using Firebase Realtime Database
- F1 News (NewsAPI if configured, or RSS fallback)
- Responsive grid layout with collapsible sidebar
- Animated race flag on race day
- Dark mode with neon accents, with Auto/Light/Dark toggle

## Environment Variables (.env)

Copy `.env.example` to `.env` and populate as needed:

- News (optional)
  - REACT_APP_NEWSAPI_KEY=<your_key>  # Note: NewsAPI may disallow browser-side use for free tier
  - REACT_APP_RSS2JSON_API_URL=https://api.rss2json.com/v1/api.json (optional override)

- Firebase for Chat (optional)
  - REACT_APP_FIREBASE_API_KEY=...
  - REACT_APP_FIREBASE_AUTH_DOMAIN=...
  - REACT_APP_FIREBASE_DATABASE_URL=...
  - REACT_APP_FIREBASE_PROJECT_ID=...
  - REACT_APP_FIREBASE_STORAGE_BUCKET=...
  - REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
  - REACT_APP_FIREBASE_APP_ID=...

If Firebase is not configured, the Chat page will show a helpful message and remain disabled.

## Data Sources
- Ergast Developer API: schedule and standings
- News API: NewsAPI.org (if API key present) or public RSS via rss2json fallback

## Scripts
- npm start
- npm run build
- npm test
