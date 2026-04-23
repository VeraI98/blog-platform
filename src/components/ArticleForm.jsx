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
  const [tags, setTags] = useState([])
  const [tagValue, setTagValue] = useState('')

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
      setTags(article.tagList || [])
    }
  }, [article, reset])

  function handleAddTag(e) {
    if (e.key === 'Enter' && tagValue.trim()) {
      e.preventDefault()
      const newTag = tagValue.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagValue('')
    }
  }

  function handleRemoveTag(tag) {
    setTags(tags.filter((t) => t !== tag))
  }

  async function onSubmit(values) {
    setServerErrors(null)
    setSubmitting(true)
    try {
      let result
      if (isEdit) {
        result = await updateArticle(user.token, article.slug, { ...values, tagList: tags })
      } else {
        result = await createArticle(user.token, { ...values, tagList: tags })
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
    <div className="write-page">
      <div className="write-card">
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
          <div className="write-field">
            <input
              className={`write-input${errors.title ? ' write-input--error' : ''}`}
              type="text"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="write-error">{errors.title.message}</p>}
          </div>

          <div className="write-field">
            <input
              className={`write-input${errors.description ? ' write-input--error' : ''}`}
              type="text"
              placeholder="Short description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="write-error">{errors.description.message}</p>}
          </div>

          {/* Body */}
          <div className="write-field">
            <textarea
              className={`write-input write-textarea${errors.body ? ' write-input--error' : ''}`}
              placeholder="Input your text"
              rows={12}
              {...register('body', { required: 'Article text is required' })}
            />
            {errors.body && <p className="write-error">{errors.body.message}</p>}
          </div>

          {/* теги */}
          <div className="write-field">
            <input
              className="write-input write-input--tags"
              type="text"
              placeholder="Add tag and press Enter"
              value={tagValue}
              onChange={(e) => setTagValue(e.target.value)}
              onKeyDown={handleAddTag}
            />
            {tags.length > 0 && (
              <div className="write-tags">
                {tags.map((tag) => (
                  <span key={tag} className="write-tag">
                    {tag}
                    <button
                      type="button"
                      className="write-tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="write-actions">
            <button className="write-btn-publish" type="submit" disabled={submitting}>
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
