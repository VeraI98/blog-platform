import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateUserApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  useEffect(() => {
    if (!user) {
      navigate('/sign-in')
      return
    }
    reset({
      image: user.image || '',
      username: user.username || '',
      bio: user.bio || '',
      email: user.email || '',
      password: '',
    })
  }, [user, reset, navigate])

  async function onSubmit(values) {
    setServerErrors(null)
    setSuccess(false)
    setSubmitting(true)

    const fields = { ...values }
    if (!fields.password) delete fields.password

    try {
      const updated = await updateUserApi(user.token, fields)
      updateUser({ ...updated, token: user.token })
      setSuccess(true)
    } catch (errs) {
      if (errs && typeof errs === 'object') {
        setServerErrors(errs)
        // Highlight individual fields that have server errors
        Object.entries(errs).forEach(([field, msgs]) => {
          if (['username', 'email', 'password', 'image', 'bio'].includes(field)) {
            setError(field, {
              type: 'server',
              message: [].concat(msgs)[0],
            })
          }
        })
      } else {
        setServerErrors({ general: ['Something went wrong. Please try again.'] })
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">Your Settings</h1>

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

        {success && <div className="form-success">Profile updated successfully!</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Avatar URL */}
          <div className="form-group">
            <input
              className={`form-input${errors.image ? ' input-error' : ''}`}
              type="text"
              placeholder="URL of profile picture"
              {...register('image', {
                pattern: {
                  value: /^(https?:\/\/).+/,
                  message: 'Avatar image must be a valid URL (http:// or https://)',
                },
              })}
            />
            {errors.image && <p className="field-error">{errors.image.message}</p>}
          </div>

          {/* Username */}
          <div className="form-group">
            <input
              className={`form-input${errors.username ? ' input-error' : ''}`}
              type="text"
              placeholder="Username"
              {...register('username', {
                required: 'Username must not be empty',
              })}
            />
            {errors.username && <p className="field-error">{errors.username.message}</p>}
          </div>

          {/* Bio */}
          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder="Short bio about you"
              rows={5}
              {...register('bio')}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <input
              className={`form-input${errors.email ? ' input-error' : ''}`}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Email must not be empty',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email must be valid',
                },
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          {/* New password (optional) */}
          <div className="form-group">
            <input
              className={`form-input${errors.password ? ' input-error' : ''}`}
              type="password"
              placeholder="New password (leave blank to keep current)"
              autoComplete="new-password"
              {...register('password', {
                minLength: {
                  value: 6,
                  message: 'New password must be at least 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'New password must be at most 40 characters',
                },
              })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <button className="btn-submit" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Update Settings'}
          </button>
        </form>

        <hr className="settings-divider" />

        <button className="btn-logout-block" onClick={handleLogout}>
          Or click here to logout.
        </button>
      </div>
    </div>
  )
}
