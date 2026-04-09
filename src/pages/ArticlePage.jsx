import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useFetch } from '../hooks/useFetch'
import { fetchArticle } from '../utils/api'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 14, height: 14, fill: 'currentColor' }}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()

  const { data: article, loading, error, refetch } = useFetch(() => fetchArticle(slug), [slug])

  if (loading) {
    return <Loading text="Loading article..." />
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1140, margin: '24px auto', padding: '0 15px' }}>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    )
  }

  if (!article) return null

  const { title, body, author, createdAt, favoritesCount, tagList } = article

  return (
    <>
      {/* Banner with title and meta */}
      <div className="article-page-banner">
        <h1>{title}</h1>
        <div className="article-meta">
          <div className="author-info">
            <img
              className="author-avatar"
              src={
                author.image ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}&backgroundColor=ffffff&fontColor=5cb85c`
              }
              alt={author.username}
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}`
              }}
              style={{ width: 36, height: 36 }}
            />
            <div className="author-details">
              <span className="author-name">{author.username}</span>
              <span className="article-date">{formatDate(createdAt)}</span>
            </div>
          </div>

          <button className="btn-like" disabled title="Sign in to like articles">
            <HeartIcon />
            {favoritesCount}
          </button>
        </div>
      </div>

      {/* Article body */}
      <div className="article-body-wrap">
        <Link to="/" className="back-link">
          ← Back to articles
        </Link>

        <div className="article-body-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>

        {tagList && tagList.length > 0 && (
          <div className="article-page-tags">
            {tagList.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
