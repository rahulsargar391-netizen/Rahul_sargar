import { useEffect, useState } from 'react'
import api, { errorText } from '../../api'
import { ErrorBox, Spinner } from '../../components/ui'

function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data)).catch((err) => setError(errorText(err)))
  }, [])

  if (error) return <ErrorBox>{error}</ErrorBox>
  if (!stats) return <Spinner />

  const cards = [
    { label: 'Students', value: stats.users.students },
    { label: 'Institutions', value: stats.users.institutions },
    { label: 'Institutions awaiting approval', value: stats.users.pendingInstitutions },
    { label: 'Certificates total', value: stats.certificates.total },
    { label: 'Pending', value: stats.certificates.pending },
    { label: 'Approved', value: stats.certificates.approved },
    { label: 'Rejected', value: stats.certificates.rejected },
    { label: 'Public verifications', value: stats.verifications },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Platform statistics</h1>
      <p className="mt-1 text-slate-400">A quick look at how BASP is being used.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glow-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">{c.label}</p>
            <p className="text-gradient mt-1 text-3xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="glow-card mt-8 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Ledger integrity (simulated blockchain)</h2>
        <p className={`mt-2 text-2xl font-bold ${stats.ledger.ok ? 'text-emerald-400' : 'text-red-400'}`}>
          {stats.ledger.ok ? 'CHAIN INTACT' : `CHAIN BROKEN at block #${stats.ledger.brokenAt}`}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {stats.ledger.total} block(s) checked. Each block contains the hash of the block before it, so editing an old record breaks the chain.
        </p>
        <p className="mt-3 text-xs text-amber-400">
          This ledger lives in MySQL. It is a teaching model, not a real blockchain, until the Ethereum testnet phase is done.
        </p>
      </div>
    </div>
  )
}

export default AdminOverview
