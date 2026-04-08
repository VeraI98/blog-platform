import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { registerUser } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  async function onSubmit({ username, email, password }) {
    setServerErrors(null)
    setLoading(true)
    try {
      const user = await registerUser({ username, email, password })
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
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-switch">
          <Link to="/sign-in">Have an account?</Link>
        </p>

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
          {/* Username */}
          <div className="form-group">
            <input
              className={`form-input${errors.username ? ' input-error' : ''}`}
              type="text"
              placeholder="Username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 20, message: 'Username must be at most 20 characters' },
              })}
            />
            {errors.username && <p className="field-error">{errors.username.message}</p>}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <input
              className={`form-input${errors.password ? ' input-error' : ''}`}
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                maxLength: { value: 40, message: 'Password must be at most 40 characters' },
              })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {/* Repeat password */}
          <div className="form-group">
            <input
              className={`form-input${errors.confirmPassword ? ' input-error' : ''}`}
              type="password"
              placeholder="Repeat Password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Agreement checkbox */}
          <div className="form-group form-group-check">
            <label className={`checkbox-label${errors.agree ? ' check-error' : ''}`}>
              <input
                type="checkbox"
                {...register('agree', {
                  required: 'You must agree to the processing of personal data',
                })}
              />
              <span>I agree to the processing of my personal information</span>
            </label>
            {errors.agree && <p className="field-error">{errors.agree.message}</p>}
          </div>

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  )
}
