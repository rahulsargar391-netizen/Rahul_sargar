import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/StatusBadge'
import { primaryButton } from '../../components/ui'

function Overview() {
  const { user } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/certificates/mine').then((res) => setCerts(res.data.certificates)).finally(() => setLoading(false))
  }, [])

  const count = (s) => certs.filter((c) => c.status === s).length
  const cards = [
    { label: 'Total', value: certs.length },
    { label: 'Pending', value: count('pending') },
    { label: 'Approved', value: count('approved') },
    { label: 'Rejected', value: count('rejected') },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
      <p className="mt-1 text-slate-400">Here is a summary of your certificates.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glow-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">{c.label}</p>
            <p className="text-gradient mt-1 text-3xl font-extrabold">{loading ? '-' : c.value}</p>
          </div>
        ))}
      </div>

      <div className="glow-card mt-8 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent certificates</h2>
          <Link to="/student/upload" className={`px-4 py-2 text-sm ${primaryButton}`}>Upload new</Link>
        </div>
        {!loading && certs.length === 0 && (
          <p className="mt-4 text-sm text-slate-400">You have not uploaded any certificates yet.</p>
        )}
        <ul className="mt-4 divide-y divide-slate-800">
          {certs.slice(0, 5).map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <Link to={`/student/certificates/${c.id}`} className="hover:text-cyan-300">
                <p className="font-medium text-white">{c.title}</p>
                <p className="text-xs text-slate-400">{c.institution?.name || 'Institution'}</p>
              </Link>
              <StatusBadge status={c.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Overview
