import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { useAuth } from './hooks/useAuth'

function App() {
  const { token, loading, error, login } = useAuth()

  if (!token) {
    return <LoginPage loading={loading.auth} error={error} onLogin={login} />
  }

  return <DashboardPage />
}

export default App
