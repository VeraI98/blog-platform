import { useEffect, useRef } from 'react'

export default function DeleteModal({ onConfirm, onCancel, pending = false }) {
  const dialog = useRef(null)
  const cancel = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    dialog.current.showModal()
    cancel.current.focus()
    return () => {
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={dialog}
      className="delete-dialog"
      aria-labelledby="delete-title"
      onCancel={(event) => {
        event.preventDefault()
        if (!pending) onCancel()
      }}
    >
      <h3 id="delete-title" className="modal-title">
        Delete Article
      </h3>
      <p className="modal-text">
        Are you sure you want to delete this article? This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button ref={cancel} className="btn-modal-cancel" disabled={pending} onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-modal-confirm" disabled={pending} onClick={onConfirm}>
          {pending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </dialog>
  )
}
