import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach the login token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('basp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Opens a private file (needs the login token, so we fetch it as a blob)
export async function openPrivateFile(id) {
  const win = window.open('', '_blank')
  try {
    const res = await api.get(`/certificates/${id}/file`, { responseType: 'blob' })
    win.location = URL.createObjectURL(res.data)
  } catch (err) {
    win.close()
    throw err
  }
}

export const errorText = (err, fallback = 'Cannot reach the server') =>
  err.response?.data?.message || fallback

export default api
