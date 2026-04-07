import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
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
          <li className="nav-item">
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sign In
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sign Up
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}
