import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  FileText,
  Clock,
  BadgeCheck,
  Users,
  Files,
  ScrollText,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const menus = {
  student: [
    { to: '/student', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/student/upload', label: 'Upload Certificate', icon: Upload },
    { to: '/student/certificates', label: 'My Certificates', icon: FileText },
  ],
  institution: [
    { to: '/institution', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/institution/pending', label: 'Pending Requests', icon: Clock },
    { to: '/institution/records', label: 'Verified Records', icon: BadgeCheck },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users and Institutions', icon: Users },
    { to: '/admin/certificates', label: 'All Certificates', icon: Files },
    { to: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
  ],
}

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = menus[user.role] || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row">
      <aside className="glow-card h-fit rounded-2xl p-5 md:w-64 md:shrink-0">
        <div className="mb-5 border-b border-cyan-500/10 pb-4">
          <p className="text-xs uppercase tracking-wider text-cyan-400">{user.role}</p>
          <p className="mt-1 font-semibold text-white">{user.name}</p>
          {user.institutionName && (
            <p className="text-xs text-slate-300">{user.institutionName}</p>
          )}
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition ${
                  isActive ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </nav>
      </aside>

      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  )
}

export default DashboardLayout
