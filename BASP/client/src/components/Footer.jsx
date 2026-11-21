import { ShieldCheck } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-cyan-500/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-cyan-400" />
          <span className="font-bold text-white">BASP</span>
          <span className="text-sm text-slate-400">Blockchain Academic Skill Passport</span>
        </div>
        <p className="text-sm text-slate-500">
          Secure • Verifiable • Student-Centric. A college engineering project.
        </p>
      </div>
    </footer>
  )
}

export default Footer
