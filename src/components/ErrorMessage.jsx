export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-state">
      <strong>Error: </strong>
      {message}
      {onRetry && (
        <div>
          <button className="btn-retry" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
