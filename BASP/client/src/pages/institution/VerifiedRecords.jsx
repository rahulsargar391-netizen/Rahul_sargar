import { useEffect, useState } from 'react'
import api, { errorText } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { ErrorBox, Spinner, fmtDate, shortHash } from '../../components/ui'

function VerifiedRecords() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/institution/certificates?status=approved')
      .then((res) => setCerts(res.data.certificates))
      .catch((err) => setError(errorText(err, 'Could not load records')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Verified student records</h1>
      <p className="mt-1 text-slate-400">Certificates your institution has approved.</p>

      <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>
      {loading && <Spinner />}
      {!loading && !error && certs.length === 0 && <p className="mt-6 text-slate-400">No approved certificates yet.</p>}

      <div className="mt-6 grid gap-4">
        {certs.map((c) => (
          <div key={c.id} className="glow-card rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{c.title}</h2>
                <p className="text-sm text-slate-400">{c.student?.name} ({c.student?.email})</p>
                <p className="text-xs text-slate-500">Approved {fmtDate(c.reviewedAt)} • {c.certCode}</p>
                <p className="mt-1 font-mono text-xs text-cyan-400">{shortHash(c.fileHash)}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VerifiedRecords
