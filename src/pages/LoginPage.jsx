export function LoginPage({ loading, error, onLogin }) {
  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <p className="eyebrow">AI Pull Request Review</p>
        <h1>ReviewAI</h1>
        <p className="lede">
          Connect GitHub, select an open PR, and generate a Gemini-powered review with risks,
          refactors, test gaps, and file-level comments.
        </p>
        <button className="primary-button" type="button" onClick={onLogin} disabled={loading}>
          {loading ? 'Connecting...' : 'Continue with GitHub'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </section>
    </main>
  )
}
