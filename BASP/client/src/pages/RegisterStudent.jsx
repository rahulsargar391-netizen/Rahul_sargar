import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { errorText } from '../api'
import AuthCard from '../components/AuthCard'
import { inputClass, primaryButton, ErrorBox } from '../components/ui'

function RegisterStudent() {
  const { registerStudent } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.password) return setError('Please fill in all fields')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    if (form.password !== form.confirm) return setError('Passwords do not match')

    setBusy(true)
    try {
      await registerStudent({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Create student account" subtitle="Start your academic skill passport">
      <div className="space-y-4">
        <input name="name" placeholder="Full name" value={form.name} onChange={change} className={inputClass} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} className={inputClass} />
        <input name="password" type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={change} className={inputClass} />
        <input name="confirm" type="password" placeholder="Confirm password" value={form.confirm} onChange={change} className={inputClass} />
        <ErrorBox>{error}</ErrorBox>
        <button onClick={handleSubmit} disabled={busy} className={`w-full py-3 ${primaryButton}`}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Log in</Link>
      </p>
    </AuthCard>
  )
}

export default RegisterStudent
