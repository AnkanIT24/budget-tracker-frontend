import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser())

  const login = useCallback(async (data) => {
    const response = await authService.login(data)
    authService.saveSession(response)
    setUser({ fullName: response.fullName, email: response.email })
    return response
  }, [])

  const register = useCallback(async (data) => {
    const response = await authService.register(data)
    authService.saveSession(response)
    setUser({ fullName: response.fullName, email: response.email })
    return response
  }, [])

  const logout = useCallback(() => {
    authService.clearSession()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
