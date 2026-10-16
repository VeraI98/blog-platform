import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { fetchArticle } from '../utils/api'
import ArticleForm from '../components/ArticleForm'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function EditArticlePage() {
  const { slug } = useParams()
  const { user } = useAuth()

  const {
    data: article,
    loading,
    error,
  } = useFetch(() => fetchArticle(slug, user?.token), [slug, user?.token])

  if (loading) return <Loading text="Loading article..." />
  if (error)
    return (
      <div style={{ maxWidth: 1140, margin: '24px auto', padding: '0 15px' }}>
        <ErrorMessage message={error} />
      </div>
    )

  if (article?.author.username !== user?.username) {
    return <ErrorMessage message="You can only edit your own articles." />
  }
  return <ArticleForm key={article.slug} article={article} />
}
