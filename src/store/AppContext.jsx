import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { api, ApiError } from '../services/api'
import { API_BASE_URL, AUTH_TOKEN_KEY, GITHUB_CLIENT_ID, REDIRECT_URI, THEME_KEY } from '../config'
import { AppContext } from './appContext'

const initialState = {
  token: localStorage.getItem(AUTH_TOKEN_KEY),
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
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.token }
    case 'SET_USER':
      return { ...state, user: action.user }
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.repositories }
    case 'SET_SELECTED_REPOSITORY':
      return { ...state, selectedRepository: action.repository }
    case 'SET_PULL_REQUESTS':
      return { ...state, pullRequests: action.pullRequests }
    case 'SET_SELECTED_PULL_REQUEST':
      return { ...state, selectedPullRequest: action.pullRequest }
    case 'SET_REVIEWS':
      return { ...state, reviews: action.reviews }
    case 'SET_ACTIVE_REVIEW':
      return { ...state, activeReview: action.review }
    case 'SET_SEARCH':
      return { ...state, search: action.search }
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'RESET_SESSION':
      return {
        ...initialState,
        theme: state.theme,
        token: null,
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const client = useMemo(() => api(API_BASE_URL, state.token), [state.token])

  const setLoading = useCallback((key, value) => {
    dispatch({ type: 'SET_LOADING', key, value })
  }, [])

  const handleError = useCallback((error) => {
    dispatch({
      type: 'SET_ERROR',
      error: error instanceof ApiError ? error.message : 'Something went wrong',
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    dispatch({ type: 'RESET_SESSION' })
  }, [])

  const login = useCallback(() => {
    if (!GITHUB_CLIENT_ID) {
      dispatch({
        type: 'SET_ERROR',
        error: 'Missing VITE_GITHUB_CLIENT_ID in the frontend environment.',
      })
      return
    }

    const query = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'repo read:user',
    })
    window.location.href = `https://github.com/login/oauth/authorize?${query}`
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', error: '' })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem(THEME_KEY, state.theme)
  }, [state.theme])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthError = params.get('error_description') || params.get('error')
    if (oauthError && !state.token) {
      dispatch({ type: 'SET_ERROR', error: oauthError.replace(/\+/g, ' ') })
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    const code = params.get('code')
    if (!code || state.token) return

    // OAuth codes are single-use. Mark synchronously so remounts cannot redeem twice.
    const codeKey = `oauth_code_${code}`
    if (sessionStorage.getItem(codeKey)) return
    sessionStorage.setItem(codeKey, '1')

    setLoading('auth', true)
    client.authWithGithub(code, REDIRECT_URI)
      .then((payload) => {
        localStorage.setItem(AUTH_TOKEN_KEY, payload.token)
        dispatch({ type: 'SET_TOKEN', token: payload.token })
        dispatch({ type: 'SET_USER', user: payload.user })
        window.history.replaceState({}, document.title, window.location.pathname)
      })
      .catch((error) => {
        sessionStorage.removeItem(codeKey)
        handleError(error)
        window.history.replaceState({}, document.title, window.location.pathname)
      })
      .finally(() => setLoading('auth', false))
  }, [client, handleError, setLoading, state.token])

  useEffect(() => {
    if (!state.token || state.user) return

    let cancelled = false
    setLoading('me', true)
    client.me()
      .then((user) => {
        if (!cancelled) dispatch({ type: 'SET_USER', user })
      })
      .catch((error) => {
        if (cancelled) return
        if (error.status === 401) logout()
        else handleError(error)
      })
      .finally(() => {
        if (!cancelled) setLoading('me', false)
      })

    return () => {
      cancelled = true
    }
  }, [client, handleError, logout, setLoading, state.token, state.user])

  const value = useMemo(() => ({
    state,
    dispatch,
    client,
    login,
    logout,
    clearError,
    handleError,
    setLoading,
  }), [state, client, login, logout, clearError, handleError, setLoading])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
