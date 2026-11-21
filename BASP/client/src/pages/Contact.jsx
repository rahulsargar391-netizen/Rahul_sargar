function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold text-white">Contact</h1>
      <p className="mt-3 text-slate-400">BASP is a college engineering project.</p>
      <div className="glow-card mt-8 rounded-2xl p-6 text-slate-300">
        <p>Department of Information Technology</p>
        <p className="mt-2">Dr. J. J. Magdum College of Engineering, Jaysingpur</p>
        <p>Team Members:</p>

        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Rahul Sargar , mob: +91 7219584572</li>
          <li>Sayali Sarnobat , mob: +91 9860642409</li>
          <li>Shreya Sutar , mob: +91 8073818223 </li>
          <li>Abhijit Tarte , mob: +91 9876543210</li>
        </ol>

      </div>
    </div>
  )
}

export default Contact
