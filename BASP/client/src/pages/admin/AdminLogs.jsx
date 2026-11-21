import { useEffect, useState } from 'react'
import api, { errorText } from '../../api'
import { ErrorBox, Spinner, fmtDateTime } from '../../components/ui'

function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/logs')
      .then((res) => setLogs(res.data.logs))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Activity logs</h1>
      <p className="mt-1 text-slate-400">The 200 most recent actions on the platform.</p>

      <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>
      {loading && <Spinner />}

      <div className="glow-card mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">{fmtDateTime(l.createdAt)}</td>
                <td className="px-4 py-3 font-mono text-xs text-cyan-300">{l.action}</td>
                <td className="px-4 py-3 text-slate-300">{l.user}</td>
                <td className="px-4 py-3 text-slate-400">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminLogs
