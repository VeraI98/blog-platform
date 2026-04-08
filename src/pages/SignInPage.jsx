import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { loginUser } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function SignInPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit(values) {
    setServerErrors(null)
    setLoading(true)
    try {
      const user = await loginUser(values)
      login(user)
      navigate('/')
    } catch (errs) {
      setServerErrors(errs)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-switch">
          <Link to="/sign-up">Need an account?</Link>
        </p>

        {/* Server errors */}
        {serverErrors && (
          <ul className="form-errors-list">
            {Object.entries(serverErrors).map(([field, msgs]) =>
              [].concat(msgs).map((msg, i) => (
                <li key={`${field}-${i}`}>
                  {field} {msg}
                </li>
              ))
            )}
          </ul>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <input
              className={`form-input${errors.email ? ' input-error' : ''}`}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email must be valid' },
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <input
              className={`form-input${errors.password ? ' input-error' : ''}`}
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
