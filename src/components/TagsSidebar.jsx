import { useFetch } from '../hooks/useFetch'
import { fetchTags } from '../utils/api'

export default function TagsSidebar({ selectedTag, onSelectTag }) {
  const { data: tags, loading } = useFetch(() => fetchTags(), [])
  
  const displayedTags = (tags || []).slice(0, 5)

  return (
    <aside className="sidebar-col">
      <div className="sidebar-box">
        <p className="sidebar-title">Popular tags</p>
        {loading ? (
          <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Loading tags...</p>
        ) : (
          <div className="popular-tags">
            {displayedTags.map((tag) => (
              <button
                key={tag}
                className={`popular-tag${selectedTag === tag ? ' selected' : ''}`}
                onClick={() => onSelectTag(selectedTag === tag ? '' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}