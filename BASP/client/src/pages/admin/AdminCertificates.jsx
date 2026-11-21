import { useEffect, useState } from 'react'
import api, { errorText } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { ErrorBox, Spinner, fmtDate } from '../../components/ui'

function AdminCertificates() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/certificates')
      .then((res) => setCerts(res.data.certificates))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">All certificates</h1>
      <p className="mt-1 text-slate-400">Every certificate on the platform (the 300 newest).</p>

      <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>
      {loading && <Spinner />}

      <div className="glow-card mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {certs.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.certCode}</td>
                <td className="px-4 py-3 text-white">{c.title}</td>
                <td className="px-4 py-3 text-slate-300">{c.student}</td>
                <td className="px-4 py-3 text-slate-300">{c.institution}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-slate-400">{fmtDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCertificates
