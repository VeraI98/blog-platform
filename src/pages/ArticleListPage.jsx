import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { fetchArticles } from '../utils/api'
import ArticlePreview from '../components/ArticlePreview'
import Pagination from '../components/Pagination'
import TagsSidebar from '../components/TagsSidebar'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const LIMIT = 10

export default function ArticleListPage() {
  const [page, setPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState('')

  const { data, loading, error, refetch } = useFetch(
    () => fetchArticles({ page, limit: LIMIT, tag: selectedTag }),
    [page, selectedTag]
  )

  const totalPages = data ? Math.ceil(data.articlesCount / LIMIT) : 0

  function handlePageChange(newPage) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSelectTag(tag) {
    setSelectedTag(tag)
    setPage(1)
  }

  return (
    <>
      {/* Banner */}
      <div className="banner">
        <h1>Realworld Blog</h1>
        <p>A place to share your knowledge.</p>
      </div>

      <div className="page-content">
        {/* Tags сверху */}
        <TagsSidebar selectedTag={selectedTag} onSelectTag={handleSelectTag} />

        {/* Main feed */}
        <div className="feed-col">
          <div className="feed-toggle">
            <button
              className={`feed-tab${!selectedTag ? ' active' : ''}`}
              onClick={() => handleSelectTag('')}
            >
              Global Feed
            </button>
            {selectedTag && <button className="feed-tab active"># {selectedTag}</button>}
          </div>

          {loading && <Loading />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {!loading && !error && data && (
            <>
              {data.articles.length === 0 ? (
                <div className="loading-state">
                  <p>No articles found.</p>
                </div>
              ) : (
                data.articles.map((article) => (
                  <ArticlePreview key={article.slug} article={article} />
                ))
              )}

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
