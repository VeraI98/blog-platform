import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Realworld Blog
        </Link>

        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <NavLink to="/new-post" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {/* ✏️ ИКОНКА: src/assets/icons/edit.svg — карандаш */}
                  {/* Замените span ниже на: <img src={editIcon} alt="" /> */}
                  <span className="nav-icon">✏</span>
                  New Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                  {/* ⚙️ ИКОНКА: src/assets/icons/settings.svg — шестерёнка */}
                  {/* Замените span ниже на: <img src={settingsIcon} alt="" /> */}
                  <span className="nav-icon">⚙</span>
                  Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={`/profile/${user.username}`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {/*
                   * 👤 АВАТАР ПОЛЬЗОВАТЕЛЯ:
                   * Здесь отображается аватар из профиля.
                   * Если у пользователя нет фото — показывается иконка-заглушка.
                   * ИКОНКА-ЗАГЛУШКА: src/assets/icons/user.svg — силуэт человека
                   * Замените img-заглушку ниже на: <img src={userIcon} alt="" />
                   */}
                  <img
                    src={
                      user.image ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}&backgroundColor=5cb85c&fontColor=ffffff`
                    }
                    alt={user.username}
                    className="nav-avatar"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`
                    }}
                  />
                  {user.username}
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-btn-logout" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/sign-in" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/sign-up" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
