import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { errorText } from '../api'
import AuthCard from '../components/AuthCard'
import { inputClass, primaryButton, ErrorBox } from '../components/ui'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }
    setBusy(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to your BASP account">
      <div className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className={inputClass}
        />
        <ErrorBox>{error}</ErrorBox>
        <button onClick={handleSubmit} disabled={busy} className={`w-full py-3 ${primaryButton}`}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-slate-400">
        New here?{' '}
        <Link to="/register" className="text-cyan-400 hover:underline">Student sign up</Link> or{' '}
        <Link to="/register-institution" className="text-cyan-400 hover:underline">register an institution</Link>
      </p>
    </AuthCard>
  )
}

export default Login
