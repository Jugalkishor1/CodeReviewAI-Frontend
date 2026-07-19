function ReviewList({ title, items = [] }) {
  return (
    <section>
      <h3>{title}</h3>
      {items.length ? (
        <ul>{items.map((item, i) => <li key={`${title}-${i}`}>{item}</li>)}</ul>
      ) : (
        <p className="empty">None reported.</p>
      )}
    </section>
  )
}

export function ReviewCard({ review, loading }) {
  if (loading) return <div className="review-card skeleton">AI is reviewing the diff...</div>
  if (!review) return <div className="review-card empty">No AI review yet. Run a review to create one.</div>

  return (
    <div className="review-card">
      <div className="score-block">
        <span>Overall score</span>
        <strong>{review.score}/10</strong>
      </div>
      <section>
        <h3>Summary</h3>
        <p>{review.summary}</p>
      </section>
      <ReviewList title="Strengths" items={review.strengths} />
      <ReviewList title="Issues Found" items={review.issues} />
      <ReviewList title="Suggestions" items={review.suggestions} />
      <section>
        <h3>File-by-file comments</h3>
        <div className="file-comments">
          {(review.file_comments || []).map((item, i) => (
            <div className="file-comment" key={`${item.file}-${i}`}>
              <strong>{item.file}{item.line ? `:${item.line}` : ''}</strong>
              <span>{item.severity || 'note'}</span>
              <p>{item.comment}</p>
            </div>
          ))}
          {!review.file_comments?.length && <p className="empty">No file-specific comments.</p>}
        </div>
      </section>
    </div>
  )
}
