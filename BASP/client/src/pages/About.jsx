function About() {
  const items = [
    ['The problem', 'Paper and PDF certificates are easy to fake, and employers cannot check them quickly.'],
    ['Our idea', 'The issuing institution approves each certificate. BASP stores its SHA-256 fingerprint, so any later change is detected.'],
    ['Student-centric', 'Students own their passport, choose whether their name is public, and share only a QR link.'],
    ['Honest status', 'This is a college MVP. The ledger is simulated locally; a real Ethereum testnet contract and IPFS storage are the next integration steps.'],
  ]
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-bold text-white">About <span className="text-gradient">BASP</span></h1>
      <p className="mt-3 text-slate-400">Blockchain Academic Skill Passport: Secure • Verifiable • Student-Centric</p>
      <div className="mt-10 grid gap-5">
        {items.map(([title, text]) => (
          <div key={title} className="glow-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-300">{title}</h2>
            <p className="mt-2 text-slate-300">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
