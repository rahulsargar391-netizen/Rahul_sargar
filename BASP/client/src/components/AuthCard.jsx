import { ShieldCheck } from 'lucide-react'

function AuthCard({ title, subtitle, children }) {
  return (
    <div className="grid-bg relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="glow-card relative w-full max-w-md rounded-2xl p-8">
        <div className="mb-6 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-cyan-400" />
          <h1 className="mt-3 text-2xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthCard
