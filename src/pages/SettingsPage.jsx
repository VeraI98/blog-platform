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
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      image: user.image || '',
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
        Object.entries(errs).forEach(([field, msgs]) => {
          if (['username', 'email', 'password', 'image', 'bio'].includes(field)) {
            setError(field, { type: 'server', message: [].concat(msgs)[0] })
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
    <div className="settings-page">
      <div className="settings-card">
        <h1 className="settings-title">Your Settings</h1>

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
          {/* Username */}
          <div className="settings-field">
            <input
              className={`settings-input${errors.username ? ' settings-input--error' : ''}`}
              type="text"
              placeholder="Username"
              {...register('username', { required: 'Username must not be empty' })}
            />
            {errors.username && <p className="settings-error">{errors.username.message}</p>}
          </div>

          {/* еmail */}
          <div className="settings-field">
            <input
              className={`settings-input${errors.email ? ' settings-input--error' : ''}`}
              type="email"
              placeholder="Email Address"
              {...register('email', {
                required: 'Email must not be empty',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email must be valid' },
              })}
            />
            {errors.email && <p className="settings-error">{errors.email.message}</p>}
          </div>

          {/* био */}
          <div className="settings-field">
            <textarea
              className="settings-input settings-textarea"
              placeholder="Input your bio"
              rows={5}
              {...register('bio')}
            />
          </div>

          {/* ссылка */}
          <div className="settings-field">
            <input
              className={`settings-input${errors.image ? ' settings-input--error' : ''}`}
              type="text"
              placeholder="Avatar image (URL)"
              {...register('image', {
                pattern: {
                  value: /^(https?:\/\/).+/,
                  message: 'Avatar image must be a valid URL',
                },
              })}
            />
            {errors.image && <p className="settings-error">{errors.image.message}</p>}
          </div>

          {/* рassword */}
          <div className="settings-field">
            <input
              className={`settings-input${errors.password ? ' settings-input--error' : ''}`}
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              {...register('password', {
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                maxLength: { value: 40, message: 'Password must be at most 40 characters' },
              })}
            />
            {errors.password && <p className="settings-error">{errors.password.message}</p>}
          </div>

          <div className="settings-actions">
            <button className="settings-btn-submit" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Update Settings'}
            </button>
          </div>
        </form>

        <hr className="settings-divider" />

        <button className="settings-btn-logout" onClick={handleLogout}>
          Or click here to logout.
        </button>
      </div>
    </div>
  )
}
