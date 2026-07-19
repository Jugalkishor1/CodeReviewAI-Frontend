import { create } from 'zustand'
import { api, ApiError } from './api'

const TOKEN_KEY = 'authToken'
const THEME_KEY = 'theme'
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
const REDIRECT_URI = (import.meta.env.VITE_GITHUB_REDIRECT_URI || window.location.origin).replace(/\/$/, '')

export const useStore = create((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  repositories: [],
  selectedRepository: null,
  pullRequests: [],
  selectedPullRequest: null,
  reviews: [],
  activeReview: null,
  search: '',
  loading: {},
  error: '',
  theme: localStorage.getItem(THEME_KEY) || 'dark',

  setLoading: (key, value) => set((s) => ({ loading: { ...s.loading, [key]: value } })),
  setError: (error) => set({ error }),
  clearError: () => set({ error: '' }),
  setSearch: (search) => set({ search }),

  fail: (error) => {
    set({ error: error instanceof ApiError ? error.message : 'Something went wrong' })
  },

  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },

  login: () => {
    if (!GITHUB_CLIENT_ID) {
      set({ error: 'Missing VITE_GITHUB_CLIENT_ID' })
      return
    }
    const query = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'repo read:user',
    })
    window.location.href = `https://github.com/login/oauth/authorize?${query}`
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({
      token: null,
      user: null,
      repositories: [],
      selectedRepository: null,
      pullRequests: [],
      selectedPullRequest: null,
      reviews: [],
      activeReview: null,
      search: '',
      loading: {},
      error: '',
    })
  },

  exchangeCode: async (code) => {
    const key = `oauth_${code}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    get().setLoading('auth', true)
    try {
      const data = await api('/auth/github', {
        method: 'POST',
        body: { code, redirect_uri: REDIRECT_URI },
      })
      localStorage.setItem(TOKEN_KEY, data.token)
      set({ token: data.token, user: data.user })
      window.history.replaceState({}, '', window.location.pathname)
    } catch (error) {
      sessionStorage.removeItem(key)
      get().fail(error)
      window.history.replaceState({}, '', window.location.pathname)
    } finally {
      get().setLoading('auth', false)
    }
  },

  loadUser: async () => {
    const { token, user, setLoading, fail, logout } = get()
    if (!token || user) return
    setLoading('me', true)
    try {
      set({ user: await api('/me', { token }) })
    } catch (error) {
      if (error.status === 401) logout()
      else fail(error)
    } finally {
      setLoading('me', false)
    }
  },

  loadRepos: async (query = '') => {
    const { token, setLoading, fail } = get()
    setLoading('repos', true)
    try {
      set({ repositories: await api(`/repositories?search=${encodeURIComponent(query)}`, { token }) })
    } catch (error) {
      fail(error)
    } finally {
      setLoading('repos', false)
    }
  },

  selectRepo: async (repository) => {
    const { token, setLoading, fail } = get()
    set({ selectedRepository: repository, selectedPullRequest: null, activeReview: null })
    setLoading('prs', true)
    try {
      set({ pullRequests: await api(`/repositories/${repository.id}/pull_requests`, { token }) })
    } catch (error) {
      fail(error)
    } finally {
      setLoading('prs', false)
    }
  },

  selectPr: async (pullRequest) => {
    const { token, setLoading, fail } = get()
    setLoading('pr', true)
    try {
      const details = await api(`/pull_requests/${pullRequest.id}`, { token })
      set({ selectedPullRequest: details, activeReview: details.reviews?.[0] || null })
    } catch (error) {
      fail(error)
    } finally {
      setLoading('pr', false)
    }
  },

  runReview: async () => {
    const { token, selectedPullRequest, setLoading, fail } = get()
    if (!selectedPullRequest) return
    setLoading('review', true)
    set({ error: '' })
    try {
      const review = await api(`/pull_requests/${selectedPullRequest.id}/review`, { token, method: 'POST' })
      set({
        activeReview: review,
        selectedPullRequest: {
          ...selectedPullRequest,
          reviews: [review, ...(selectedPullRequest.reviews || [])],
        },
      })
      await get().loadReviews()
    } catch (error) {
      fail(error)
    } finally {
      setLoading('review', false)
    }
  },

  loadReviews: async () => {
    const { token, setLoading, fail } = get()
    setLoading('reviews', true)
    try {
      set({ reviews: await api('/reviews', { token }) })
    } catch (error) {
      fail(error)
    } finally {
      setLoading('reviews', false)
    }
  },

  openHistory: async (review) => {
    const { token, repositories, setLoading, fail } = get()
    setLoading('history', true)
    try {
      const pullRequest = await api(`/pull_requests/${review.pull_request_id}`, { token })
      const repository = repositories.find((r) => r.id === review.repository_id) || {
        id: review.repository_id,
        full_name: review.repository_full_name,
      }
      const pullRequests = await api(`/repositories/${repository.id}/pull_requests`, { token })
      set({
        selectedRepository: repository,
        pullRequests,
        selectedPullRequest: pullRequest,
        activeReview: review,
      })
    } catch (error) {
      fail(error)
    } finally {
      setLoading('history', false)
    }
  },

  deleteReview: async (review) => {
    const { token, setLoading, fail } = get()
    if (!window.confirm(`Delete review for "${review.pull_request_title}"?`)) return
    setLoading('delete', true)
    try {
      await api(`/reviews/${review.id}`, { token, method: 'DELETE' })
      set((s) => ({
        reviews: s.reviews.filter((r) => r.id !== review.id),
        activeReview: s.activeReview?.id === review.id ? null : s.activeReview,
        selectedPullRequest: s.selectedPullRequest
          ? {
              ...s.selectedPullRequest,
              reviews: (s.selectedPullRequest.reviews || []).filter((r) => r.id !== review.id),
            }
          : s.selectedPullRequest,
      }))
    } catch (error) {
      fail(error)
    } finally {
      setLoading('delete', false)
    }
  },
}))
