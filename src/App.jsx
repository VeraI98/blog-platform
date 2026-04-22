import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ArticleListPage from './pages/ArticleListPage'
import ArticlePage from './pages/ArticlePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import NewPostPage from './pages/NewPostPage'

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 15px', color: 'var(--text-muted)' }}>
      <h2 style={{ fontSize: '5rem', color: 'var(--border)', fontWeight: 700 }}>404</h2>
      <p style={{ marginTop: 8 }}>Page not found.</p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles" element={<Navigate to="/" replace />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="site-footer">
        <a href="/">Realworld Blog</a> &copy; {new Date().getFullYear()}
      </footer>
    </>
  )
}
