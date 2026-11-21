import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import { primaryButton, Notice } from '../../components/ui'

function InstOverview() {
  const { user } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(user.isApproved)

  useEffect(() => {
    if (!user.isApproved) return
    api.get('/institution/certificates').then((res) => setCerts(res.data.certificates)).finally(() => setLoading(false))
  }, [user.isApproved])

  const count = (s) => certs.filter((c) => c.status === s).length
  const cards = [
    { label: 'Total requests', value: certs.length },
    { label: 'Pending', value: count('pending') },
    { label: 'Approved', value: count('approved') },
    { label: 'Rejected', value: count('rejected') },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">{user.institutionName || 'Institution'} dashboard</h1>
      <p className="mt-1 text-slate-400">Certificates sent to your institution.</p>

      {!user.isApproved && (
        <div className="mt-6">
          <Notice>
            Your institution is waiting for approval by a BASP admin. You can review certificates after approval. Refresh this page after an admin has approved you.
          </Notice>
        </div>
      )}

      {user.isApproved && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="glow-card rounded-2xl p-5">
                <p className="text-sm text-slate-400">{c.label}</p>
                <p className="text-gradient mt-1 text-3xl font-extrabold">{loading ? '-' : c.value}</p>
              </div>
            ))}
          </div>

          <div className="glow-card mt-8 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Waiting for your review</h2>
            <p className="mt-2 text-sm text-slate-400">
              {loading ? 'Loading...' : count('pending') === 0 ? 'No pending requests right now.' : `${count('pending')} certificate(s) are waiting.`}
            </p>
            <Link to="/institution/pending" className={`mt-4 inline-block px-5 py-2 text-sm ${primaryButton}`}>
              Open pending requests
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default InstOverview
