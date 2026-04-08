import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { updateUserApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [serverErrors, setServerErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        image: user.image || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        password: '',
      })
    }
  }, [user, reset])

  async function onSubmit(values) {
    setServerErrors(null)
    setSuccess(false)
    setLoading(true)

    const fields = { ...values }
    if (!fields.password) delete fields.password

    try {
      const updated = await updateUserApi(user.token, fields)
      updateUser({ ...updated, token: user.token })
      setSuccess(true)
    } catch (errs) {
      setServerErrors(errs)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (!user) {
    navigate('/sign-in')
    return null
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">Your Settings</h1>

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

        {success && <div className="form-success">Profile updated successfully!</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/*ПОЛЕ аватара*/}
          <div className="form-group">
            <input
              className={`form-input${errors.image ? ' input-error' : ''}`}
              type="url"
              placeholder="URL of profile picture"
              {...register('image', {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Avatar image must be a valid URL',
                },
              })}
            />
            {errors.image && <p className="field-error">{errors.image.message}</p>}
          </div>

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

          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder="Short bio about you"
              rows={5}
              {...register('bio')}
            />
          </div>

          <div className="form-group">
            <input
              className={`form-input${errors.email ? ' input-error' : ''}`}
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'Email must not be empty',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email must be valid' },
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <input
              className={`form-input${errors.password ? ' input-error' : ''}`}
              type="password"
              placeholder="New password (leave blank to keep current)"
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

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update Settings'}
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
