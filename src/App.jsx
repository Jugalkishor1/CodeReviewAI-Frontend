import { useEffect } from 'react'
import { useStore } from './store'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'

export default function App() {
  const token = useStore((s) => s.token)
  const theme = useStore((s) => s.theme)
  const exchangeCode = useStore((s) => s.exchangeCode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthError = params.get('error_description') || params.get('error')

    if (oauthError && !token) {
      useStore.setState({ error: oauthError.replace(/\+/g, ' ') })
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    const code = params.get('code')
    if (code && !token) exchangeCode(code)
  }, [token, exchangeCode])

  return token ? <DashboardPage /> : <LoginPage />
}
