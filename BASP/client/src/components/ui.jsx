// Small shared pieces so the pages stay short
export const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400'

export const primaryButton =
  'rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white disabled:opacity-60'

export const outlineButton =
  'rounded-lg border border-cyan-500/40 text-cyan-300 transition hover:bg-cyan-500/10'

export function ErrorBox({ children }) {
  if (!children) return null
  return (
    <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{children}</p>
  )
}

export function Notice({ children }) {
  return (
    <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300">{children}</p>
  )
}

export function Spinner({ text = 'Loading...' }) {
  return <p className="mt-6 text-slate-400">{text}</p>
}

export const shortHash = (h) => (h ? `${h.slice(0, 12)}...${h.slice(-8)}` : '')

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '-')
export const fmtDateTime = (d) => (d ? new Date(d).toLocaleString() : '-')
