import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On page load, check whether a saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem('basp_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('basp_token'))
      .finally(() => setLoading(false))
  }, [])

  const saveSession = (data) => {
    localStorage.setItem('basp_token', data.token)
    setUser(data.user)
    return data.user
  }

  const login = async (email, password) =>
    saveSession((await api.post('/auth/login', { email, password })).data)

  const registerStudent = async (form) =>
    saveSession((await api.post('/auth/register-student', form)).data)

  const registerInstitution = async (form) =>
    saveSession((await api.post('/auth/register-institution', form)).data)

  const logout = () => {
    localStorage.removeItem('basp_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerStudent, registerInstitution, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
