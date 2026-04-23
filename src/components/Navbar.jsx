import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import editIcon from '../assets/icons/edit.png'
import settingsIcon from '../assets/icons/setttings.png'
import userIcon from '../assets/icons/user.png'

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
                  <img src={editIcon} alt="" className="nav-icon-img" />
                  New Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <img src={settingsIcon} alt="" className="nav-icon-img" />
                  Settings
                </NavLink>
              </li>
              <li className="nav-item">
                {/* encodeURIComponent обрабатывает пробелы*/}
                <NavLink
                  to={`/profile/${encodeURIComponent(user.username)}`}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <img
                    src={user.image || userIcon}
                    alt={user.username}
                    className="nav-avatar"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = userIcon
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
