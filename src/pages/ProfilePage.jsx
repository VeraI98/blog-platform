import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { fetchProfile, fetchUserArticles } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ArticlePreview from '../components/ArticlePreview'
import Pagination from '../components/Pagination'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const LIMIT = 5
const BASE_URL = 'https://realworld.habsida.net/api'

export default function ProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('my')
  const [followState, setFollowState] = useState(null)
  const [followLoading, setFollowLoading] = useState(false)

  const decodedUsername = decodeURIComponent(username)
  const token = user?.token || null
  const isOwn = user?.username === decodedUsername

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useFetch(() => fetchProfile(decodedUsername, token), [decodedUsername])

  const isFollowing = followState !== null ? followState : profile?.following

  const {
    data: articlesData,
    loading: articlesLoading,
    error: articlesError,
    refetch,
  } = useFetch(() => {
    const offset = (page - 1) * LIMIT
    const params = new URLSearchParams({ limit: LIMIT, offset })
    if (activeTab === 'my') {
      params.set('author', decodedUsername)
    } else {
      params.set('favorited', decodedUsername)
    }
    return fetch(`${BASE_URL}/articles?${params}`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    }).then((r) => r.json())
  }, [decodedUsername, page, activeTab])

  const totalPages = articlesData ? Math.ceil(articlesData.articlesCount / LIMIT) : 0

  async function handleFollow() {
    if (!user || followLoading) return
    setFollowLoading(true)
    const newFollowing = !isFollowing
    setFollowState(newFollowing)
    try {
      await fetch(`${BASE_URL}/profiles/${decodedUsername}/follow`, {
        method: newFollowing ? 'POST' : 'DELETE',
        headers: { Authorization: `Token ${token}` },
      })
    } catch {
      setFollowState(!newFollowing)
    } finally {
      setFollowLoading(false)
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    setPage(1)
  }

  if (profileLoading) return <Loading text="Loading profile..." />
  if (profileError)
    return (
      <div style={{ maxWidth: 1140, margin: '24px auto', padding: '0 15px' }}>
        <ErrorMessage message={profileError} />
      </div>
    )

  return (
    <>
      {/* Тёмный баннер */}
      <div className="profile-banner">
        <img
          className="profile-avatar"
          src={
            profile?.image ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${decodedUsername}&backgroundColor=888888&fontColor=ffffff`
          }
          alt={decodedUsername}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${decodedUsername}`
          }}
        />

        <h2 className="profile-username">{decodedUsername}</h2>

        {profile?.bio && <p className="profile-bio">{profile.bio}</p>}

        {/* своя страница и чужая */}
        {isOwn ? (
          <Link to="/settings" className="btn-edit-profile">
            Edit Profile Settings
          </Link>
        ) : user ? (
          <button
            className={`btn-follow${isFollowing ? ' btn-follow--active' : ''}`}
            onClick={handleFollow}
            disabled={followLoading}
          >
            {isFollowing ? `Unfollow ${decodedUsername}` : `Follow ${decodedUsername}`}
          </button>
        ) : null}
      </div>

      {/* лента  */}
      <div className="page-content">
        <div className="feed-col">
          <div className="feed-toggle">
            <button
              className={`feed-tab${activeTab === 'my' ? ' active' : ''}`}
              onClick={() => handleTabChange('my')}
            >
              My Articles
            </button>
            <button
              className={`feed-tab${activeTab === 'favorited' ? ' active' : ''}`}
              onClick={() => handleTabChange('favorited')}
            >
              Favorited Articles
            </button>
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
