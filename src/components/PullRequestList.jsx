export function PullRequestList({
  repository,
  pullRequests,
  selectedPullRequest,
  loading,
  onSelect,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Open PRs</p>
          <h2>{repository?.full_name || 'Select a repository'}</h2>
        </div>
        {loading && <span className="loader">Syncing</span>}
      </div>

      <div className="pr-list">
        {pullRequests.map((pr) => (
          <button
            key={pr.id}
            type="button"
            className={selectedPullRequest?.id === pr.id ? 'pr-row active' : 'pr-row'}
            onClick={() => onSelect(pr)}
          >
            <strong>#{pr.number} {pr.title}</strong>
            <span>{pr.author} · {pr.branch} · {pr.commits} commits</span>
          </button>
        ))}
        {!pullRequests.length && repository && !loading && (
          <p className="empty">No open pull requests found.</p>
        )}
      </div>
    </section>
  )
}
