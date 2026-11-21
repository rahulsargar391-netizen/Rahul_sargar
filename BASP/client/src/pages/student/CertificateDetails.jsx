import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { openPrivateFile } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import { outlineButton, ErrorBox, Spinner, fmtDateTime } from '../../components/ui'

function CertificateDetails() {
  const { id } = useParams()
  const [cert, setCert] = useState(null)
  const [history, setHistory] = useState([])
  const [qr, setQr] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api
      .get(`/certificates/${id}`)
      .then((res) => {
        setCert(res.data.certificate)
        setHistory(res.data.verifications)
        if (res.data.certificate.status === 'approved') {
          return api.get(`/certificates/${id}/qr`).then((r) => setQr(r.data))
        }
      })
      .catch(() => setError('Certificate not found'))
  }, [id])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qr.verifyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy, please select the link and copy it')
    }
  }

  if (!cert) {
    return (
      <div>
        <ErrorBox>{error}</ErrorBox>
        {!error && <Spinner />}
        <Link to="/student/certificates" className="mt-4 inline-block text-cyan-400">Back to my certificates</Link>
      </div>
    )
  }

  const row = 'flex justify-between gap-4 border-b border-slate-800 py-2 text-sm'

  return (
    <div className="max-w-3xl">
      <Link to="/student/certificates" className="text-sm text-cyan-400 hover:underline">Back to my certificates</Link>

      <div className="glow-card mt-4 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">{cert.title}</h1>
          <StatusBadge status={cert.status} />
        </div>

        <div className="mt-4">
          <div className={row}><span className="text-slate-400">Certificate ID</span><span className="font-mono text-white">{cert.certCode}</span></div>
          <div className={row}><span className="text-slate-400">Institution</span><span className="text-white">{cert.institution?.name}</span></div>
          <div className={row}><span className="text-slate-400">Issue date</span><span className="text-white">{cert.issueDate || '-'}</span></div>
          <div className={row}><span className="text-slate-400">File</span><span className="text-white">{cert.originalName}</span></div>
          <div className={row}><span className="text-slate-400">Name on public page</span><span className="text-white">{cert.showName ? 'Shown' : 'Hidden'}</span></div>
        </div>

        <p className="mt-4 text-xs text-slate-400">SHA-256 fingerprint of your file</p>
        <p className="break-all font-mono text-xs text-cyan-400">{cert.fileHash}</p>

        {cert.reviewNote && (
          <p className="mt-4 rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-300">Institution note: {cert.reviewNote}</p>
        )}

        <button onClick={() => openPrivateFile(id).catch(() => setError('Could not open the file'))} className={`mt-5 px-4 py-2 text-sm ${outlineButton}`}>
          View file
        </button>
        <div className="mt-3"><ErrorBox>{error}</ErrorBox></div>
      </div>

      {cert.status === 'approved' && qr && (
        <div className="glow-card mt-6 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Share your credential</h2>
          <p className="mt-1 text-sm text-slate-400">Anyone can scan this QR code to verify the certificate.</p>
          <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
            <img src={qr.dataUrl} alt="QR code" className="h-44 w-44 rounded-xl bg-white p-1" />
            <div className="min-w-0 flex-1">
              <p className="break-all rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-cyan-300">{qr.verifyUrl}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button onClick={copyLink} className={`px-4 py-1.5 text-sm ${outlineButton}`}>
                  {copied ? 'Copied' : 'Copy link'}
                </button>
                <a href={qr.dataUrl} download={`${cert.certCode}-qr.png`} className={`px-4 py-1.5 text-sm ${outlineButton}`}>
                  Download QR
                </a>
              </div>
            </div>
          </div>

          {cert.ledger && (
            <p className="mt-5 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-400">
              Recorded in ledger block #{cert.ledger.block}. <span className="text-amber-400">SIMULATED ledger</span>, not a real blockchain yet.
            </p>
          )}
        </div>
      )}

      {cert.status !== 'approved' && (
        <p className="mt-6 text-sm text-slate-400">
          A QR code and share link appear here after your institution approves the certificate.
        </p>
      )}

      <div className="glow-card mt-6 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Verification history</h2>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">Nobody has checked this certificate yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-800 text-sm">
            {history.map((h) => (
              <li key={h.id} className="flex justify-between gap-3 py-2">
                <span className="text-slate-300">{h.action === 'VERIFY_CHECK' ? 'File checked' : 'Page viewed'}{h.details && h.action === 'VERIFY_CHECK' ? ` - ${h.details}` : ''}</span>
                <span className="text-slate-500">{fmtDateTime(h.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CertificateDetails
