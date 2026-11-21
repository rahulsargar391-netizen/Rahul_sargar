import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white">
        Back to home
      </Link>
    </div>
  )
}

export default NotFound
