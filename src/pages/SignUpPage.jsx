import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { registerUser } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const passwordValue = watch('password', '')

  async function onSubmit({ username, email, password }) {
    setServerErrors(null)
    setSubmitting(true)
    try {
      const user = await registerUser({ username, email, password })
      login(user)
      navigate('/')
    } catch (errs) {
      if (errs && typeof errs === 'object') {
        setServerErrors(errs)
      } else {
        setServerErrors({ general: ['Something went wrong. Please try again.'] })
      }
    } finally {
      setSubmitting(false)
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
          <ul className="server-errors">
            {Object.entries(serverErrors).map(([field, msgs]) =>
              [].concat(msgs).map((msg, i) => (
                <li key={`${field}-${i}`}>
                  {field !== 'general' ? `${field} ` : ''}
                  {msg}
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
              autoComplete="username"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'Username must be at most 20 characters',
                },
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
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email must be valid',
                },
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
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Password must be at most 40 characters',
                },
              })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <input
              className={`form-input${errors.confirmPassword ? ' input-error' : ''}`}
              type="password"
              placeholder="Repeat Password"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordValue || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Agreement */}
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

          <button className="btn-submit" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  )
}
