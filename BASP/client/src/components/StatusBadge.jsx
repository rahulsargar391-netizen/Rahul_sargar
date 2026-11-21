const styles = {
  pending: 'bg-amber-500/15 text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-400',
  rejected: 'bg-red-500/15 text-red-400',
  active: 'bg-emerald-500/15 text-emerald-400',
  disabled: 'bg-red-500/15 text-red-400',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
        styles[status] || 'bg-slate-700 text-slate-300'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
