import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { errorText } from '../api'
import { inputClass, primaryButton, ErrorBox, fmtDate, fmtDateTime } from '../components/ui'

const resultStyle = {
  VERIFIED: { box: 'border-emerald-500/40 bg-emerald-500/10', text: 'text-emerald-400', label: 'VERIFIED', note: 'This file matches the recorded fingerprint exactly.' },
  INVALID: { box: 'border-red-500/40 bg-red-500/10', text: 'text-red-400', label: 'INVALID', note: 'This file does NOT match the recorded fingerprint. It may have been changed.' },
  NOT_FOUND: { box: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-400', label: 'NOT FOUND', note: 'No approved certificate exists with this ID.' },
}

// Page 1: type a certificate ID
function VerifyHome() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const go = () => {
    const clean = code.trim().toUpperCase()
    if (clean) navigate(`/verify/${clean}`)
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="text-4xl font-bold text-white">Verify a <span className="text-gradient">certificate</span></h1>
      <p className="mt-3 text-slate-400">Scan the QR code, or type the certificate ID (for example BASP-9F3A1C0B7E).</p>
      <div className="glow-card mt-8 space-y-4 rounded-2xl p-6">
        <input
          placeholder="BASP-XXXXXXXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          className={inputClass}
        />
        <button onClick={go} className={`w-full py-3 ${primaryButton}`}>Check certificate</button>
      </div>
    </div>
  )
}

// Page 2: the result for one certificate
function VerifyResult({ code }) {
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const [file, setFile] = useState(null)
  const [check, setCheck] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setState('loading')
    setCheck(null)
    api
      .get(`/verify/${code}`)
      .then((res) => { setData(res.data.certificate); setState('found') })
      .catch((err) => setState(err.response?.status === 404 ? 'notfound' : 'error'))
  }, [code])

  const runCheck = async () => {
    setError('')
    if (!file) return setError('Please choose the certificate file to check')
    const form = new FormData()
    form.append('file', file)
    setBusy(true)
    try {
      const res = await api.post(`/verify/${code}/check`, form)
      setCheck(res.data)
    } catch (err) {
      setError(errorText(err))
    } finally {
      setBusy(false)
    }
  }

  if (state === 'loading') return <p className="px-5 py-20 text-center text-slate-400">Checking...</p>

  if (state === 'error') {
    return <p className="px-5 py-20 text-center text-red-400">Could not reach the server.</p>
  }

  if (state === 'notfound') {
    const s = resultStyle.NOT_FOUND
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <div className={`rounded-2xl border p-8 ${s.box}`}>
          <p className={`text-3xl font-extrabold ${s.text}`}>{s.label}</p>
          <p className="mt-2 text-slate-300">{s.note}</p>
          <p className="mt-3 break-all font-mono text-xs text-slate-500">{code}</p>
        </div>
        <Link to="/verify" className="mt-6 inline-block text-cyan-400 hover:underline">Try another ID</Link>
      </div>
    )
  }

  const row = 'flex justify-between gap-4 border-b border-slate-800 py-2 text-sm'

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <div className="glow-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">{data.title}</h1>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            APPROVED
          </span>
        </div>

        <div className="mt-4">
          <div className={row}><span className="text-slate-400">Certificate ID</span><span className="font-mono text-white">{data.certCode}</span></div>
          <div className={row}><span className="text-slate-400">Student</span><span className="text-white">{data.studentName}</span></div>
          <div className={row}><span className="text-slate-400">Issuing institution</span><span className="text-white">{data.institution}</span></div>
          <div className={row}><span className="text-slate-400">Issue date</span><span className="text-white">{data.issueDate || '-'}</span></div>
          <div className={row}><span className="text-slate-400">Approved on</span><span className="text-white">{fmtDate(data.approvedOn)}</span></div>
        </div>

        <p className="mt-4 text-xs text-slate-400">Recorded SHA-256 fingerprint</p>
        <p className="break-all font-mono text-xs text-cyan-400">{data.recordedHash}</p>

        {data.ledger && (
          <p className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-400">
            Ledger block #{data.ledger.block}. <span className="text-amber-400">SIMULATED ledger</span>, not a real blockchain yet.
          </p>
        )}
      </div>

      <div className="glow-card mt-6 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Check a file</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose the certificate file you were given. It is hashed and compared; it is not saved.
        </p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => { setFile(e.target.files[0] || null); setCheck(null) }}
          className="mt-4 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500/15 file:px-4 file:py-2 file:text-cyan-300"
        />
        <div className="mt-3"><ErrorBox>{error}</ErrorBox></div>
        <button onClick={runCheck} disabled={busy} className={`mt-4 w-full py-3 ${primaryButton}`}>
          {busy ? 'Checking...' : 'Check file'}
        </button>

        {check && (
          <div className={`mt-5 rounded-2xl border p-5 text-center ${resultStyle[check.result].box}`}>
            <p className={`text-3xl font-extrabold ${resultStyle[check.result].text}`}>
              {resultStyle[check.result].label}
            </p>
            <p className="mt-2 text-sm text-slate-300">{resultStyle[check.result].note}</p>
            <p className="mt-3 break-all text-left font-mono text-xs text-slate-400">Your file: {check.uploadedHash}</p>
            <p className="break-all text-left font-mono text-xs text-slate-400">Recorded: {check.recordedHash}</p>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">Checked {fmtDateTime(new Date())}</p>
    </div>
  )
}

export function VerifyByCode() {
  const { code } = useParams()
  return <VerifyResult code={code.toUpperCase()} />
}

export default VerifyHome
