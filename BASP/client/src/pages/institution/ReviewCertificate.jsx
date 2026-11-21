import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api, { openPrivateFile, errorText } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { inputClass, outlineButton, ErrorBox } from '../../components/ui'

function ReviewCertificate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cert, setCert] = useState(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api
      .get(`/institution/certificates/${id}`)
      .then((res) => setCert(res.data.certificate))
      .catch((err) => setError(errorText(err, 'Certificate not found')))
  }, [id])

  const decide = async (decision) => {
    setError('')
    if (decision === 'rejected' && !note.trim()) return setError('Please write a reason for rejecting')

    setBusy(true)
    try {
      await api.patch(`/institution/certificates/${id}/review`, { decision, note })
      navigate('/institution/pending')
    } catch (err) {
      setError(errorText(err, 'Something went wrong'))
    } finally {
      setBusy(false)
    }
  }

  if (!cert) {
    return (
      <div>
        <ErrorBox>{error}</ErrorBox>
        {!error && <p className="text-slate-400">Loading...</p>}
        <Link to="/institution/pending" className="mt-4 inline-block text-cyan-400">Back to pending requests</Link>
      </div>
    )
  }

  const row = 'flex justify-between gap-4 border-b border-slate-800 py-2 text-sm'

  return (
    <div className="max-w-2xl">
      <Link to="/institution/pending" className="text-sm text-cyan-400 hover:underline">Back to pending requests</Link>

      <div className="glow-card mt-4 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">{cert.title}</h1>
          <StatusBadge status={cert.status} />
        </div>

        <div className="mt-4">
          <div className={row}><span className="text-slate-400">Certificate ID</span><span className="font-mono text-white">{cert.certCode}</span></div>
          <div className={row}><span className="text-slate-400">Student</span><span className="text-white">{cert.student?.name}</span></div>
          <div className={row}><span className="text-slate-400">Email</span><span className="text-white">{cert.student?.email}</span></div>
          <div className={row}><span className="text-slate-400">Issue date</span><span className="text-white">{cert.issueDate || 'Not given'}</span></div>
          <div className={row}><span className="text-slate-400">File</span><span className="text-white">{cert.originalName}</span></div>
        </div>

        <p className="mt-4 text-xs text-slate-400">SHA-256 fingerprint taken at upload</p>
        <p className="break-all font-mono text-xs text-cyan-400">{cert.fileHash}</p>

        {cert.description && <p className="mt-4 text-sm text-slate-300">{cert.description}</p>}

        <button
          onClick={() => openPrivateFile(id).catch(() => setError('Could not open the file'))}
          className={`mt-5 px-4 py-2 text-sm ${outlineButton}`}
        >
          Open certificate file
        </button>

        {cert.status === 'pending' ? (
          <div className="mt-6 space-y-3 border-t border-slate-800 pt-5">
            <textarea
              rows="3"
              placeholder="Note for the student (required if you reject)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
            />
            <ErrorBox>{error}</ErrorBox>
            <p className="text-xs text-slate-500">
              On approval the file is hashed again and compared with the fingerprint above.
            </p>
            <div className="flex gap-3">
              <button onClick={() => decide('approved')} disabled={busy} className="flex-1 rounded-lg bg-emerald-600 py-3 font-semibold text-white disabled:opacity-60">
                Approve
              </button>
              <button onClick={() => decide('rejected')} disabled={busy} className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white disabled:opacity-60">
                Reject
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-400">
            This certificate was already reviewed.{cert.reviewNote && ` Note: ${cert.reviewNote}`}
          </p>
        )}
      </div>
    </div>
  )
}

export default ReviewCertificate
