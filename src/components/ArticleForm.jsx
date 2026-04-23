import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { createArticle, updateArticle } from '../utils/api'

export default function ArticleForm({ article }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const isEdit = Boolean(article)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  useEffect(() => {
    if (article) {
      reset({
        title: article.title || '',
        description: article.description || '',
        body: article.body || '',
      })
      setTagInput((article.tagList || []).join(', '))
    }
  }, [article, reset])

  async function onSubmit(values) {
    setServerErrors(null)
    setSubmitting(true)

    const tagList = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      let result
      if (isEdit) {
        result = await updateArticle(user.token, article.slug, { ...values, tagList })
      } else {
        result = await createArticle(user.token, { ...values, tagList })
      }
      navigate(`/articles/${result.slug}`)
    } catch (errs) {
      if (errs && typeof errs === 'object') {
        setServerErrors(errs)
      } else {
        setServerErrors({ general: ['Something went wrong. Please try again.'] })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">{isEdit ? 'Edit Article' : 'New Article'}</h1>

        {serverErrors && (
          <ul className="server-errors">
            {Object.entries(serverErrors).map(([field, msgs]) =>
              [].concat(msgs).map((msg, i) => (
                <li key={`${field}-${i}`}>
                  {field !== 'general' ? `${field} ` : ''}
                  {msg}
                </li>
              ))
            )}
          </ul>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <input
              className={`form-input${errors.title ? ' input-error' : ''}`}
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="field-error">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <input
              className={`form-input${errors.description ? ' input-error' : ''}`}
              type="text"
              placeholder="Short description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="field-error">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <textarea
              className={`form-input form-textarea form-textarea-tall${errors.body ? ' input-error' : ''}`}
              placeholder="Write your article (in markdown)"
              rows={10}
              {...register('body', { required: 'Article text is required' })}
            />
            {errors.body && <p className="field-error">{errors.body.message}</p>}
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="Tags (comma separated: react, javascript)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />

            {/* тэги */}
            {tagInput && (
              <div className="tags-preview">
                {tagInput
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button className="btn-submit btn-submit-right" type="submit" disabled={submitting}>
              {submitting
                ? isEdit
                  ? 'Saving...'
                  : 'Publishing...'
                : isEdit
                  ? 'Save Changes'
                  : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
