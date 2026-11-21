import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'

import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import RegisterStudent from './pages/RegisterStudent'
import RegisterInstitution from './pages/RegisterInstitution'
import Dashboard from './pages/Dashboard'
import VerifyHome, { VerifyByCode } from './pages/Verify'

import Overview from './pages/student/Overview'
import UploadCertificate from './pages/student/UploadCertificate'
import MyCertificates from './pages/student/MyCertificates'
import CertificateDetails from './pages/student/CertificateDetails'

import InstOverview from './pages/institution/InstOverview'
import PendingRequests from './pages/institution/PendingRequests'
import ReviewCertificate from './pages/institution/ReviewCertificate'
import VerifiedRecords from './pages/institution/VerifiedRecords'

import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCertificates from './pages/admin/AdminCertificates'
import AdminLogs from './pages/admin/AdminLogs'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterStudent />} />
          <Route path="/register-institution" element={<RegisterInstitution />} />

          {/* Public verification (QR codes open /verify/CODE) */}
          <Route path="/verify" element={<VerifyHome />} />
          <Route path="/verify/:code" element={<VerifyByCode />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/student" element={<ProtectedRoute roles={['student']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="upload" element={<UploadCertificate />} />
            <Route path="certificates" element={<MyCertificates />} />
            <Route path="certificates/:id" element={<CertificateDetails />} />
          </Route>

          <Route path="/institution" element={<ProtectedRoute roles={['institution']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<InstOverview />} />
            <Route path="pending" element={<PendingRequests />} />
            <Route path="review/:id" element={<ReviewCertificate />} />
            <Route path="records" element={<VerifiedRecords />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="logs" element={<AdminLogs />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
