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
          <span>Gemini code review</span>
        </div>
      </div>

      <label className="search">
        <span>Search repositories</span>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="owner/repo"
        />
      </label>

      <div className="list-heading">
        <span>Repositories</span>
        {loading && <small>Loading</small>}
      </div>
      <div className="repo-list">
        {repositories.map((repository) => (
          <button
            key={repository.id}
            type="button"
            className={selectedRepository?.id === repository.id ? 'list-item active' : 'list-item'}
            onClick={() => onSelectRepository(repository)}
          >
            <strong>{repository.full_name}</strong>
            <span>{repository.private ? 'Private' : 'Public'}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
