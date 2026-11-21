import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Sends each person to the dashboard for their role
function Dashboard() {
  const { user } = useAuth()
  const target = { student: '/student', institution: '/institution', admin: '/admin' }[user.role]
  return <Navigate to={target || '/'} replace />
}

export default Dashboard
