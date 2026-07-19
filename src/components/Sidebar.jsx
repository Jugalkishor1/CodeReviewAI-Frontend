export function Sidebar({
  repositories,
  selectedRepository,
  search,
  loading,
  onSearchChange,
  onSelectRepository,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">PR</div>
        <div>
          <strong>ReviewAI</strong>
          <span>AI code review</span>
        </div>
      </div>

      <label className="search">
        <span>Search repositories</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="owner/repo"
        />
      </label>

      <div className="list-heading">
        <span>Repositories</span>
        {loading && <small>Loading</small>}
      </div>

      <div className="repo-list">
        {repositories.map((repo) => (
          <button
            key={repo.id}
            type="button"
            className={selectedRepository?.id === repo.id ? 'list-item active' : 'list-item'}
            onClick={() => onSelectRepository(repo)}
          >
            <strong>{repo.full_name}</strong>
            <span>{repo.private ? 'Private' : 'Public'}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
