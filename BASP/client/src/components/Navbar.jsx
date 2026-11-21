import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Verify', to: '/verify' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const linkClass = 'text-sm text-slate-300 transition hover:text-cyan-400'

  const renderLink = (l, onClick) =>
    l.to ? (
      <Link key={l.label} to={l.to} onClick={onClick} className={linkClass}>
        {l.label}
      </Link>
    ) : (
      <a key={l.label} href={l.href} onClick={onClick} className={linkClass}>
        {l.label}
      </a>
    )

  const buttonClass =
    'rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30'

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-cyan-400" />
          <span className="text-2xl font-extrabold tracking-wide text-white">BASP</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">{links.map((l) => renderLink(l))}</div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link to="/dashboard" className={buttonClass}>
              My dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-cyan-400">
                Log in
              </Link>
              <Link to="/register" className={buttonClass}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="text-slate-200 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-cyan-500/10 bg-slate-950 px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((l) => renderLink(l, () => setOpen(false)))}
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-cyan-400">
                My dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-slate-300">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-cyan-400">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
