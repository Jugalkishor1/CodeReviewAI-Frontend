export function ReviewHistory({ reviews, loading, onSelect }) {
  return (
    <section className="panel history-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Review History</p>
          <h2>Saved reviews</h2>
        </div>
        {loading && <span className="loader">Loading</span>}
      </div>
      <div className="history-list">
        {reviews.map((review) => (
          <button
            key={review.id}
            type="button"
            className="history-row"
            onClick={() => onSelect(review)}
          >
            <strong>{review.repository_full_name}</strong>
            <span>{review.pull_request_title}</span>
            <b>{review.score}/10</b>
          </button>
        ))}
        {!reviews.length && <p className="empty">Generated reviews will be stored here.</p>}
      </div>
    </section>
  )
}
