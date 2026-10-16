import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'rw_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const login = useCallback((userData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } catch {
      /* Keep authentication in memory if storage is blocked. */
    }
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* Keep authentication in memory if storage is blocked. */
    }
    setUser(null)
  }, [])

  const updateUser = useCallback((userData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } catch {
      /* Keep authentication in memory if storage is blocked. */
    }
    setUser(userData)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
