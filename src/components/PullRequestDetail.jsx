import { ReviewCard } from './ReviewCard'

function Stat({ label, value, tone }) {
  return (
    <div className={`stat ${tone || ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function PullRequestDetail({ pullRequest, review, loading, reviewing, onRunReview }) {
  if (!pullRequest) {
    return (
      <section className="panel detail-panel">
        <div className="empty-state">
          <h2>Pick a pull request to inspect.</h2>
          <p>Repository PRs, stats, and AI reviews appear here.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="panel detail-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">PR Details</p>
          <h2>{pullRequest.title}</h2>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={onRunReview}
          disabled={reviewing}
        >
          {reviewing ? 'Reviewing...' : 'Run AI review'}
        </button>
      </div>

      <div className="stats">
        <Stat label="Author" value={pullRequest.author} />
        <Stat label="Branch" value={`${pullRequest.branch} -> ${pullRequest.base_branch}`} />
        <Stat label="Files" value={pullRequest.files_changed} />
        <Stat label="Additions" value={`+${pullRequest.additions}`} tone="good" />
        <Stat label="Deletions" value={`-${pullRequest.deletions}`} tone="bad" />
        <Stat label="Commits" value={pullRequest.commits} />
      </div>

      <ReviewCard review={review} loading={loading || reviewing} />
    </section>
  )
}
