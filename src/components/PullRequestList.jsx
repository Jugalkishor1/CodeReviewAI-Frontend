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
        {pullRequests.map((pullRequest) => (
          <button
            key={pullRequest.id}
            type="button"
            className={selectedPullRequest?.id === pullRequest.id ? 'pr-row active' : 'pr-row'}
            onClick={() => onSelect(pullRequest)}
          >
            <strong>#{pullRequest.number} {pullRequest.title}</strong>
            <span>{pullRequest.author} · {pullRequest.branch} · {pullRequest.commits} commits</span>
          </button>
        ))}
        {!pullRequests.length && repository && !loading && (
          <p className="empty">No open pull requests found.</p>
        )}
      </div>
    </section>
  )
}
