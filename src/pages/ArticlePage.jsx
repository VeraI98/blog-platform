import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useFetch } from '../hooks/useFetch'
import { fetchArticle, deleteArticle, favoriteArticle, unfavoriteArticle } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import DeleteModal from '../components/DeleteModal'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'currentColor' }}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [favoriting, setFavoriting] = useState(false)

  const { data: article, loading, error, refetch } = useFetch(() => fetchArticle(slug), [slug])

  const [localFavorited, setLocalFavorited] = useState(null)
  const [localCount, setLocalCount] = useState(null)
  const favorited = localFavorited !== null ? localFavorited : article?.favorited
  const favCount = localCount !== null ? localCount : article?.favoritesCount

  // клик на имя
  function handleAuthorClick(username) {
    if (!user) {
      navigate('/sign-up')
    } else {
      navigate(`/profile/${encodeURIComponent(username)}`)
    }
  }

  async function handleFavorite() {
    if (!user || favoriting) return
    setFavoriting(true)
    const newFavorited = !favorited
    setLocalFavorited(newFavorited)
    setLocalCount((favCount || 0) + (newFavorited ? 1 : -1))
    try {
      const updated = newFavorited
        ? await favoriteArticle(user.token, slug)
        : await unfavoriteArticle(user.token, slug)
      setLocalFavorited(updated.favorited)
      setLocalCount(updated.favoritesCount)
    } catch {
      setLocalFavorited(!newFavorited)
      setLocalCount(favCount || 0)
    } finally {
      setFavoriting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteArticle(user.token, slug)
      navigate('/')
    } catch {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) return <Loading text="Loading article..." />
  if (error)
    return (
      <div style={{ maxWidth: 700, margin: '24px auto', padding: '0 15px' }}>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    )
  if (!article) return null

  const { title, body, author, createdAt, tagList } = article
  const isOwn = user?.username === author.username

  return (
    <div className="ap-wrapper">
      <div className="ap-spacer" />
      <div className="ap-banner">
        <h1 className="ap-title">{title}</h1>
        <div className="ap-banner-author">
          <img
            className="ap-avatar"
            src={
              author.image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}&backgroundColor=888888&fontColor=ffffff`
            }
            alt={author.username}
            onClick={() => handleAuthorClick(author.username)}
            style={{ cursor: 'pointer' }}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}`
            }}
          />
          <div>
            <span
              className="ap-author-name"
              onClick={() => handleAuthorClick(author.username)}
              style={{ cursor: 'pointer' }}
            >
              {author.username}
            </span>
            <span className="ap-date">{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="ap-content">
        <div className="ap-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>

        {tagList && tagList.length > 0 && (
          <div className="ap-tags">
            {tagList.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="ap-footer">
          <div className="ap-footer-author">
            <img
              className="ap-avatar"
              src={
                author.image || `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}`
              }
              alt={author.username}
              onClick={() => handleAuthorClick(author.username)}
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}`
              }}
            />
            <div className="ap-footer-author-info">
              <span
                className="ap-footer-author-name"
                onClick={() => handleAuthorClick(author.username)}
                style={{ cursor: 'pointer' }}
              >
                {author.username}
              </span>
              <span className="ap-footer-date">{formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="ap-footer-actions">
            {isOwn ? (
              <>
                <Link to={`/articles/${slug}/edit`} className="ap-btn-edit">
                  Edit
                </Link>
                <button
                  className="ap-btn-delete"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleting}
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                className={`ap-btn-favorite${favorited ? ' ap-btn-favorite--active' : ''}`}
                onClick={handleFavorite}
                disabled={!user || favoriting}
                style={{ cursor: !user ? 'not-allowed' : favoriting ? 'wait' : 'pointer' }}
                title={!user ? 'Sign in to favorite' : ''}
              >
                <HeartIcon />
                {favorited ? 'Unfavorite' : 'Favorite article'} ({favCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} />
      )}
    </div>
  )
}
