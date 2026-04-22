import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function NewPostPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/sign-in')
  }, [user, navigate])

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">New Post</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 8 }}>
          Потом допишу
        </p>
      </div>
    </div>
  )
}
