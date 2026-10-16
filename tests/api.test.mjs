import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const load = async (path) =>
  import(
    `data:text/javascript;base64,${Buffer.from(await readFile(path, 'utf8')).toString('base64')}`
  )
const api = await load('src/utils/api.js')
const { formErrors } = await load('src/utils/errors.js')

test('authenticated article requests include the token and pagination', async (t) => {
  const calls = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), options })
    return { ok: true, json: async () => ({ article: { slug: 'sample' }, articles: [] }) }
  })
  await api.fetchArticles({ token: 'example', page: 3, tag: 'A & B' })
  await api.fetchArticle('sample', 'example')
  assert.equal(calls[0].options.headers.Authorization, 'Token example')
  assert.equal(calls[0].url.searchParams.get('offset'), '20')
  assert.equal(calls[0].url.searchParams.get('tag'), 'A & B')
  assert.equal(calls[1].options.headers.Authorization, 'Token example')
})

test('public requests do not send an empty token', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    assert.equal(options.headers.Authorization, undefined)
    return { ok: true, json: async () => ({ articles: [] }) }
  })
  await api.fetchArticles()
})

test('profile names are encoded as one path segment', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.ok(url.includes('/profiles/A%25%2FB'))
    return { ok: true, json: async () => ({ profile: {} }) }
  })
  await api.fetchProfile('A%/B')
})

test('HTTP failures without validation details still provide a message', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: false,
    status: 500,
    json: async () => ({}),
  }))
  await assert.rejects(api.loginUser({ email: 'demo', password: 'test' }), /HTTP 500/)
})

test('network errors become visible form messages', () => {
  assert.deepEqual(formErrors(new TypeError('Failed to fetch')), { general: ['Failed to fetch'] })
  assert.deepEqual(formErrors(undefined), { general: ['Something went wrong. Please try again.'] })
  const validation = { email: ['has already been taken'] }
  assert.equal(formErrors(validation), validation)
})

test('favorite and unfavorite use separate HTTP methods', async (t) => {
  const methods = []
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    methods.push(options.method)
    return { ok: true, json: async () => ({ article: {} }) }
  })
  await api.favoriteArticle('example', 'sample')
  await api.unfavoriteArticle('example', 'sample')
  assert.deepEqual(methods, ['POST', 'DELETE'])
})
