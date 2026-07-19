import { useStore } from '../store'

export function LoginPage() {
  const loading = useStore((s) => s.loading.auth)
  const error = useStore((s) => s.error)
  const login = useStore((s) => s.login)

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <p className="eyebrow">AI Pull Request Review</p>
        <h1>ReviewAI</h1>
        <p className="lede">
          Connect GitHub, pick an open PR, and get an AI review with risks, refactors, and test gaps.
        </p>
        <button className="primary-button" type="button" onClick={login} disabled={loading}>
          {loading ? 'Connecting...' : 'Continue with GitHub'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </section>
    </main>
  )
}
