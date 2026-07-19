import { ThemeToggle } from './ThemeToggle'

export function Topbar({ user, theme, onToggleTheme, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1>Pull request review</h1>
      </div>
      <div className="user-pill">
        {user?.avatar_url && <img src={user.avatar_url} alt="" />}
        <span>{user?.name || user?.login || 'GitHub user'}</span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}
