export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">Delete Article</h3>
        <p className="modal-text">
          Are you sure you want to delete this article? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-modal-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
