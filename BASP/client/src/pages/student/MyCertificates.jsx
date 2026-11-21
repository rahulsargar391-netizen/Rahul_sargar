import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { openPrivateFile } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { primaryButton, outlineButton, ErrorBox, Spinner } from '../../components/ui'

function MyCertificates() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/certificates/mine')
      .then((res) => setCerts(res.data.certificates))
      .catch(() => setError('Could not load your certificates'))
      .finally(() => setLoading(false))
  }, [])

  const viewFile = async (id) => {
    try {
      await openPrivateFile(id)
    } catch {
      setError('Could not open the file')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My certificates</h1>
        <Link to="/student/upload" className={`px-4 py-2 text-sm ${primaryButton}`}>Upload new</Link>
      </div>

      <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>
      {loading && <Spinner />}
      {!loading && certs.length === 0 && (
        <p className="mt-6 text-slate-400">You have not uploaded any certificates yet.</p>
      )}

      <div className="mt-6 grid gap-4">
        {certs.map((c) => (
          <div key={c.id} className="glow-card rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{c.title}</h2>
                <p className="text-sm text-slate-400">
                  {c.institution?.name || 'Institution'}{c.issueDate && ` • Issued ${c.issueDate}`}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">{c.certCode}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>

            {c.reviewNote && (
              <p className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-300">
                Institution note: {c.reviewNote}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <Link to={`/student/certificates/${c.id}`} className={`px-4 py-1.5 text-sm ${outlineButton}`}>
                Details{c.status === 'approved' ? ' and QR code' : ''}
              </Link>
              <button onClick={() => viewFile(c.id)} className={`px-4 py-1.5 text-sm ${outlineButton}`}>
                View file
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyCertificates
