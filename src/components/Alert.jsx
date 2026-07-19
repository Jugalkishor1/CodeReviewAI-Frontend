export function Alert({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="alert">
      <span>{message}</span>
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </div>
  )
}
