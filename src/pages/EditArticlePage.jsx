import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { fetchArticle } from '../utils/api'
import ArticleForm from '../components/ArticleForm'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

export default function EditArticlePage() {
  const { slug } = useParams()

  const { data: article, loading, error } = useFetch(() => fetchArticle(slug), [slug])

  if (loading) return <Loading text="Loading article..." />
  if (error)
    return (
      <div style={{ maxWidth: 1140, margin: '24px auto', padding: '0 15px' }}>
        <ErrorMessage message={error} />
      </div>
    )

  return <ArticleForm article={article} />
}
