import { Link } from 'react-router-dom'
import {
  ShieldCheck, Upload, Fingerprint, QrCode, Database, Lock,
  Building2, GraduationCap, BadgeCheck, ArrowRight, Boxes, Search,
} from 'lucide-react'

const features = [
  { icon: Upload, title: 'Certificate Upload', text: 'Students upload PDF and image certificates, with strict file type and size checks.' },
  { icon: Fingerprint, title: 'SHA-256 Fingerprints', text: 'Every certificate gets a unique cryptographic hash. Change one pixel and the hash changes.' },
  { icon: Boxes, title: 'Ledger Integrity', text: 'Approved hashes go into a hash-chained ledger. Currently simulated; Ethereum testnet comes next.' },
  { icon: QrCode, title: 'QR Verification', text: 'Each approved certificate gets a QR code that opens a public verification page.' },
  { icon: Building2, title: 'Institution Approval', text: 'Colleges review every request and approve or reject it before it becomes verifiable.' },
  { icon: Lock, title: 'Privacy First', text: 'Files stay private. Verifiers see only what the student chose to share.' },
]

const steps = [
  { icon: GraduationCap, title: 'Student uploads', text: 'Create a profile and upload a certificate.' },
  { icon: BadgeCheck, title: 'College approves', text: 'The institution reviews and approves it.' },
  { icon: Database, title: 'Hash is recorded', text: 'A SHA-256 hash is saved as proof of integrity.' },
  { icon: Search, title: 'Anyone verifies', text: 'Scan the QR code and check the file instantly.' },
]

const stats = [
  { value: '256-bit', label: 'SHA hashing' },
  { value: '3 roles', label: 'Student, College, Admin' },
  { value: '1 scan', label: 'To verify a certificate' },
  { value: '100%', label: 'Student-centric' },
]

function Landing() {
  return (
    <div>
      <section className="grid-bg relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:py-32">
          <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300">
            <ShieldCheck className="h-4 w-4" />
            Secure • Verifiable • Student-Centric
          </div>

          <h1 className="animate-fade-up text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Your academic achievements, <span className="text-gradient">verified forever</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            BASP is the Blockchain Academic Skill Passport. Upload your certificates, get them
            approved by your institution, and let anyone verify them with a single QR scan.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30"
            >
              Create student account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/verify"
              className="rounded-lg border border-cyan-500/40 px-8 py-3.5 font-semibold text-cyan-300 transition hover:bg-cyan-500/10"
            >
              Verify a certificate
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            MVP version: the blockchain ledger is simulated and IPFS is not connected yet.
          </p>

          <div className="animate-float mx-auto mt-14 w-full max-w-md rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-6 text-left shadow-2xl shadow-cyan-500/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Sample Certificate</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">VERIFIED</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Certificate ID: BASP-9F3A1C0B7E</p>
            <p className="mt-1 text-sm text-slate-400">Issued by: Demo Engineering College</p>
            <p className="mt-3 break-all font-mono text-xs text-cyan-400">SHA-256: fb4df0660980056f26d56fe75cdaddfa...</p>
          </div>
        </div>
      </section>

      <section className="border-y border-cyan-500/10 bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-gradient text-3xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Everything you need to <span className="text-gradient">trust a credential</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Built for students, colleges and employers, with security at every step.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glow-card lift rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                <f.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-t border-cyan-500/10 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              How <span className="text-gradient">BASP</span> works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">Four simple steps from upload to verification.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="glow-card lift relative rounded-2xl p-7">
                <span className="absolute right-5 top-4 text-5xl font-extrabold text-cyan-500/10">{i + 1}</span>
                <s.icon className="h-8 w-8 text-cyan-400" />
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-10 shadow-2xl shadow-cyan-500/10">
          <h2 className="text-3xl font-bold text-white">Ready to build your skill passport?</h2>
          <p className="mt-3 text-slate-300">Join as a student or register your institution today.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-semibold text-white">
              I am a student
            </Link>
            <Link to="/register-institution" className="rounded-lg border border-cyan-500/40 px-8 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/10">
              I represent an institution
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
