const BASE_URL = 'https://realworld.habsida.net/api'

export async function fetchArticles({ page = 1, limit = 10, tag = '' } = {}) {
  const offset = (page - 1) * limit
  const params = new URLSearchParams({ limit, offset })
  if (tag) params.set('tag', tag)
  const res = await fetch(`${BASE_URL}/articles?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  return res.json() // { articles, articlesCount }
}

export async function fetchArticle(slug) {
  const res = await fetch(`${BASE_URL}/articles/${slug}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  return data.article
}

export async function fetchTags() {
  const res = await fetch(`${BASE_URL}/tags`)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  return data.tags // string[]
}
