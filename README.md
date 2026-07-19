# CodeReviewAI — Frontend

React + Vite UI for AI-powered GitHub pull request reviews.

**Backend repo:** [CodeReviewAI-Backend](https://github.com/Jugalkishor1/CodeReviewAI-Backend)

## Stack

- React 19 + Vite
- Zustand
- GitHub OAuth (browser authorize flow)

## Setup

1. Create a [GitHub OAuth App](https://github.com/settings/developers)
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:5173`
2. Ensure the backend API is running (default `http://localhost:3000`)
3. Configure env and start:

```bash
cp .env.example .env
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

## Environment variables

Copy `.env.example` → `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:5173
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_GITHUB_CLIENT_ID` | Same Client ID as the backend |
| `VITE_GITHUB_REDIRECT_URI` | Must match the OAuth App callback URL |

> `VITE_*` values are baked in at **build** time. After changing them on Vercel, redeploy.

## Scripts

```bash
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # eslint
```

## Project structure

```
src/
  App.jsx              # auth gate + OAuth bootstrap
  api.js               # API helper
  store.js             # Zustand store
  pages/               # Login, Dashboard
  components/          # UI pieces
```

## Production (Vercel)

```env
VITE_API_BASE_URL=https://your-api.onrender.com
VITE_GITHUB_CLIENT_ID=...
VITE_GITHUB_REDIRECT_URI=https://your-frontend.vercel.app
```

Update the GitHub OAuth App **callback URL** to the same production frontend URL.

## Features

- GitHub login
- Search repositories / list open PRs
- Run AI review on a PR
- Review history + delete
- Light / dark mode
