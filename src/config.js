export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
// Prefer an explicit production callback URL so preview/deploy aliases don't break OAuth.
export const REDIRECT_URI = (import.meta.env.VITE_GITHUB_REDIRECT_URI || window.location.origin).replace(/\/$/, '')
export const AUTH_TOKEN_KEY = 'authToken'
export const THEME_KEY = 'theme'
