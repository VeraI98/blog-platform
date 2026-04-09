const BASE_URL = 'https://realworld.habsida.net/api'

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
  }
}

export async function fetchArticles({ page = 1, limit = 10, tag = '' } = {}) {
  const offset = (page - 1) * limit
  const params = new URLSearchParams({ limit, offset })
  if (tag) params.set('tag', tag)
  const res = await fetch(`${BASE_URL}/articles?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchArticle(slug) {
  const res = await fetch(`${BASE_URL}/articles/${slug}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.article
}

export async function fetchTags() {
  const res = await fetch(`${BASE_URL}/tags`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.tags
}

export async function fetchUserArticles({ username, page = 1, limit = 5 }) {
  const offset = (page - 1) * limit
  const params = new URLSearchParams({ limit, offset, author: username })
  const res = await fetch(`${BASE_URL}/articles?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { email, password } }),
  })
  const data = await res.json()
  if (!res.ok) throw data.errors
  return data.user
}

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { username, email, password } }),
  })
  const data = await res.json()
  if (!res.ok) throw data.errors
  return data.user
}

export async function updateUserApi(token, fields) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ user: fields }),
  })
  const data = await res.json()
  if (!res.ok) throw data.errors
  return data.user
}

export async function fetchProfile(username, token) {
  const res = await fetch(`${BASE_URL}/profiles/${username}`, {
    headers: token ? { Authorization: `Token ${token}` } : {},
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.profile
}
