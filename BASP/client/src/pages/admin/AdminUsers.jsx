import { useEffect, useState } from 'react'
import api, { errorText } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { ErrorBox, Spinner, fmtDate } from '../../components/ui'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () =>
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const update = async (id, changes) => {
    setError('')
    try {
      await api.patch(`/admin/users/${id}`, changes)
      await load()
    } catch (err) {
      setError(errorText(err))
    }
  }

  const btn = 'rounded-lg border border-cyan-500/40 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/10'

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Users and institutions</h1>
      <p className="mt-1 text-slate-400">Approve institutions, disable accounts and manage roles.</p>

      <div className="mt-4"><ErrorBox>{error}</ErrorBox></div>
      {loading && <Spinner />}

      <div className="glow-card mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="text-white">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                  {u.institutionName && <p className="text-xs text-slate-400">{u.institutionName}</p>}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => update(u.id, { role: e.target.value })}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
                  >
                    <option value="student">student</option>
                    <option value="institution">institution</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="space-x-2 px-4 py-3">
                  <StatusBadge status={u.isActive ? 'active' : 'disabled'} />
                  {u.role === 'institution' && <StatusBadge status={u.isApproved ? 'approved' : 'pending'} />}
                </td>
                <td className="px-4 py-3 text-slate-400">{fmtDate(u.createdAt)}</td>
                <td className="space-x-2 px-4 py-3">
                  {u.role === 'institution' && !u.isApproved && (
                    <button onClick={() => update(u.id, { isApproved: true })} className={btn}>Approve</button>
                  )}
                  <button onClick={() => update(u.id, { isActive: !u.isActive })} className={btn}>
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">You cannot change your own account from this page.</p>
    </div>
  )
}

export default AdminUsers
