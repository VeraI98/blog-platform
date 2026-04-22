import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { fetchProfile, fetchUserArticles } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ArticlePreview from '../components/ArticlePreview'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import userLargeIcon from '../assets/icons/user.png'

const LIMIT = 5

export default function ProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const [page, setPage] = useState(1)

  // %20 пробел
  const decodedUsername = decodeURIComponent(username)
  const token = user?.token || null

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useFetch(() => fetchProfile(decodedUsername, token), [decodedUsername])

  const {
    data: articlesData,
    loading: articlesLoading,
    error: articlesError,
    refetch,
  } = useFetch(
    () => fetchUserArticles({ username: decodedUsername, page, limit: LIMIT }),
    [decodedUsername, page]
  )

  const totalPages = articlesData ? Math.ceil(articlesData.articlesCount / LIMIT) : 0

  const isOwn = user?.username === decodedUsername

  if (profileLoading) return <Loading text="Loading profile..." />

  if (profileError) {
    return (
      <div style={{ maxWidth: 1140, margin: '24px auto', padding: '0 15px' }}>
        <ErrorMessage message={profileError} />
      </div>
    )
  }

  return (
    <>
      <div className="profile-banner">
        <img
          className="profile-avatar"
          src={profile?.image || userLargeIcon}
          alt={decodedUsername}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = userLargeIcon
          }}
        />
        <h2 className="profile-username">{decodedUsername}</h2>
        {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
        {isOwn && (
          <Link to="/settings" className="btn-edit-profile">
            ⚙ Edit Profile Settings
          </Link>
        )}
      </div>

      <div className="page-content">
        <div className="feed-col">
          <div className="feed-toggle">
            <button className="feed-tab active">My Articles</button>
          </div>

          {articlesLoading && <Loading />}
          {articlesError && <ErrorMessage message={articlesError} onRetry={refetch} />}

          {!articlesLoading && !articlesError && articlesData && (
            <>
              {articlesData.articles.length === 0 ? (
                <div className="loading-state">
                  <p>No articles yet.</p>
                </div>
              ) : (
                articlesData.articles.map((article) => (
                  <ArticlePreview key={article.slug} article={article} />
                ))
              )}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
