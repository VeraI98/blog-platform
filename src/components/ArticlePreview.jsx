import { Link } from 'react-router-dom'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export default function ArticlePreview({ article }) {
  const { slug, title, description, author, createdAt, favoritesCount, tagList } = article

  return (
    <div className="article-preview">
      <div className="article-meta">
        <div className="author-info">
          <img
            className="author-avatar"
            src={
              author.image ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}&backgroundColor=5cb85c&fontColor=ffffff`
            }
            alt={author.username}
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}&backgroundColor=5cb85c&fontColor=ffffff`
            }}
          />
          <div className="author-details">
            <Link to={`/profile/${author.username}`} className="author-name">
              {author.username}
            </Link>
            <span className="article-date">{formatDate(createdAt)}</span>
          </div>
        </div>

        <button className="btn-like" disabled title="Sign in to like articles">
          <HeartIcon />
          {favoritesCount}
        </button>
      </div>

      <Link to={`/articles/${slug}`}>
        <h2 className="article-title">{title}</h2>
      </Link>

      <p className="article-description">{description}</p>

      <div className="article-footer">
        <Link to={`/articles/${slug}`} className="read-more">
          Read more...
        </Link>
        <div className="tag-list">
          {tagList.slice(0, 10).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
