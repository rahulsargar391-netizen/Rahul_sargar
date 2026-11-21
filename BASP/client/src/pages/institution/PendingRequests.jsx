import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorText } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { outlineButton, ErrorBox, Spinner, fmtDate } from '../../components/ui'

function PendingRequests() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/institution/certificates?status=pending')
      .then((res) => setCerts(res.data.certificates))
      .catch((err) => setError(errorText(err, 'Could not load pending requests')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Pending requests</h1>
      <p className="mt-1 text-slate-400">Review each certificate before approving it.</p>

      <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>
      {loading && <Spinner />}
      {!loading && !error && certs.length === 0 && <p className="mt-6 text-slate-400">No pending requests.</p>}

      <div className="mt-6 grid gap-4">
        {certs.map((c) => (
          <div key={c.id} className="glow-card rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{c.title}</h2>
                <p className="text-sm text-slate-400">Student: {c.student?.name} ({c.student?.email})</p>
                <p className="text-xs text-slate-500">Submitted {fmtDate(c.createdAt)}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <Link to={`/institution/review/${c.id}`} className={`mt-4 inline-block px-4 py-1.5 text-sm ${outlineButton}`}>
              Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingRequests
