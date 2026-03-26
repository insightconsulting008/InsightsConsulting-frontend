import React, { useState, useEffect, useRef } from 'react'
import axiosInstance from '@src/providers/axiosInstance'
import PageHeader from '../page-header/PageHeader'

/* ─── Icons ───────────────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2 .18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
  </svg>
)
const BadgeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const CameraIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
  </svg>
)
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
)
const UploadCloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" x2="12" y1="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

/* ─── Password input with toggle ─────────────────────────────────────── */
function PasswordField({ label, name, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-3 pr-11 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary-100"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}

/* ─── Info card ──────────────────────────────────────────────────────── */
function InfoCard({ icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-150 group cursor-default">
      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-neutral-800 truncate">{value || '—'}</p>
        {sub && <p className="text-xs text-neutral-500 mt-0.5 font-mono tracking-wide">{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Modal ──────────────────────────────────────────────────────────── */
function Modal({ title, subtitle, icon, children, onClose, size = 'md' }) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl border border-neutral-200 p-6`}
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          animation: 'modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-all hover:scale-110 active:scale-95"
        >
          <XIcon />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── Inline alert ───────────────────────────────────────────────────── */
function Alert({ type, children }) {
  if (!children) return null
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm border ${
      type === 'error'
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-green-50 border-green-200 text-green-700'
    }`}>
      <span className="font-bold mt-0.5 flex-shrink-0 text-base">
        {type === 'error' ? '⚠️' : '✓'}
      </span>
      <span className="flex-1">{children}</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [photoSuccess, setPhotoSuccess] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/user/profile')
        
        if (response.data.success) {
          setProfile(response.data.data)
        } else {
          setError('Failed to fetch profile')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile')
        console.error('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => () => { 
    if (previewUrl) URL.revokeObjectURL(previewUrl) 
  }, [previewUrl])

  const handlePasswordChange = e => {
    const { name, value } = e.target
    setPasswordData(p => ({ ...p, [name]: value }))
    setPasswordError(''); setPasswordSuccess('')
  }

  const validatePassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required')
      return false
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long')
      return false
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return false
    }
    return true
  }

  const handleSubmitPassword = async e => {
    e.preventDefault()
    if (!validatePassword()) return

    setChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const response = await axiosInstance.put('/user/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      })

      if (response.data.success) {
        setPasswordSuccess('Password changed successfully!')
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => {
          setShowPasswordModal(false)
          setPasswordSuccess('')
        }, 2000)
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleFileSelect = e => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
      setPhotoError('Please select a valid image (JPEG, PNG, or GIF)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size must be less than 5MB')
      return
    }
    setSelectedFile(file)
    setPhotoError('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setPhotoError('Please select a file to upload')
      return
    }
    
    setUploading(true)
    setPhotoError('')
    
    const formData = new FormData()
    formData.append('photoUrl', selectedFile)
    
    try {
      const response = await axiosInstance.put('/user/update-photo', formData,)
      
      if (response.data.success) {
        setPhotoSuccess('✓ Photo updated successfully!')
        setProfile(prev => ({ ...prev, photoUrl: response.data.data.photoUrl }))
        setTimeout(() => {
          setShowPhotoModal(false)
          setPhotoSuccess('')
          setSelectedFile(null)
          setPreviewUrl('')
          if (fileInputRef.current) fileInputRef.current.value = ''
        }, 2000)
      }
    } catch (err) {
      setPhotoError(err.response?.data?.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleCancelPhoto = () => {
    setShowPhotoModal(false)
    setSelectedFile(null)
    setPreviewUrl('')
    setPhotoError('')
    setPhotoSuccess('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  const statusCfg = s => {
    switch (s?.toUpperCase()) {
      case 'ACTIVE':   return { cls: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-500' }
      case 'INACTIVE': return { cls: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500' }
      case 'PENDING':  return { cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500' }
      default:         return { cls: 'bg-neutral-100 text-neutral-600 border border-neutral-200', dot: 'bg-neutral-400' }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-neutral-50">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading profile…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm shadow-lg">
          <span className="text-lg">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <p className="text-neutral-500 text-sm bg-white px-6 py-4 rounded-2xl shadow-sm border border-neutral-200">
          No profile data available
        </p>
      </div>
    )
  }

  const sc = statusCfg(profile.status)
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=22c55e&color=fff&size=128`

  return (
    <div
      className="min-h-screen bg-neutral-50"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.95) translateY(10px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .profile-card { animation: fadeUp 0.3s ease both; }
      `}</style>

      <PageHeader
        title="My Profile"
        subtitle="View and manage your account information"
        actions={
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all active:scale-95"
          >
            <LockIcon />
            Change Password
          </button>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Profile card ── */}
        <div className="profile-card bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl">

          {/* Banner with pattern */}
          <div className="h-36 relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content under banner */}
          <div className="px-6 sm:px-8 pb-8">

            {/* Avatar + identity row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 mb-8">

              {/* Avatar with enhanced container */}
              <div className="relative flex-shrink-0 self-start">
                <div className="w-28 h-28 rounded-2xl border-4 border-white overflow-hidden bg-primary-100 shadow-2xl">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = fallbackAvatar }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
                      <span className="text-4xl font-bold text-white">{profile.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary text-white rounded-xl border-2 border-white flex items-center justify-center hover:bg-primary-hover transition-all hover:scale-110 active:scale-95 shadow-lg"
                  title="Change photo"
                >
                  <CameraIcon />
                </button>
              </div>

              {/* Name and details block */}
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">{profile.name}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.cls}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                    {profile.status || 'ACTIVE'}
                  </span>
                </div>
                
                <p className="text-base text-neutral-600 capitalize mb-3">{profile.role}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent mb-6" />

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={<MailIcon />}     label="Email Address"  value={profile.email} />
              <InfoCard icon={<PhoneIcon />}    label="Phone Number"   value={profile.phoneNumber} />
              <InfoCard icon={<UserIcon />} label="Name" value={profile.name} />
              <InfoCard icon={<BadgeIcon />} label="Role" value={profile.role} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ Password Modal ══ */}
      {showPasswordModal && (
        <Modal
          title="Change Password"
          subtitle="Update your account credentials"
          icon={<LockIcon />}
          onClose={() => {
            setShowPasswordModal(false)
            setPasswordError('')
            setPasswordSuccess('')
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
          }}
          size="md"
        >
          <form onSubmit={handleSubmitPassword} className="flex flex-col gap-5">
            <PasswordField label="Current Password"  name="oldPassword"     value={passwordData.oldPassword}    onChange={handlePasswordChange} />
            <PasswordField label="New Password"       name="newPassword"     value={passwordData.newPassword}    onChange={handlePasswordChange} />
            <PasswordField label="Confirm Password"   name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />

            <Alert type="error">{passwordError}</Alert>
            <Alert type="success">{passwordSuccess}</Alert>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordError('')
                  setPasswordSuccess('')
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                }}
                className="px-6 py-3 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-all active:scale-95 border border-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
              >
                {changingPassword ? <><SpinnerIcon /> Saving…</> : 'Update Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══ Photo Modal ══ */}
      {showPhotoModal && (
        <Modal
          title="Update Profile Photo"
          subtitle="Choose a new profile picture"
          icon={<CameraIcon />}
          onClose={handleCancelPhoto}
          size="md"
        >
          <div className="flex flex-col gap-6">

            {/* Preview with enhanced styling */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-primary-100 shadow-xl">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : profile.photoUrl ? (
                    <img src={profile.photoUrl} alt="Current" className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = fallbackAvatar }} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">{profile.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                {previewUrl && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    New
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-4 py-8 px-4 rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 hover:border-primary-500 hover:bg-primary-100 transition-all cursor-pointer text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-200 transition-colors group-hover:scale-110 transform duration-200">
                <UploadCloudIcon />
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-800">Click to change photo</p>
                <p className="text-sm text-neutral-500 mt-1">Supported: JPEG, PNG, GIF — max 5 MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Selected file indicator */}
            {selectedFile && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                <span className="font-bold text-lg">✓</span>
                <span className="truncate flex-1 font-medium">{selectedFile.name}</span>
                <span className="text-xs bg-green-200 px-2 py-1 rounded-full">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}

            <Alert type="error">{photoError}</Alert>
            <Alert type="success">{photoSuccess}</Alert>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelPhoto}
                className="px-6 py-3 rounded-xl bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-all active:scale-95 border border-neutral-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadPhoto}
                disabled={uploading || !selectedFile}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
              >
                {uploading ? <><SpinnerIcon /> Uploading…</> : 'Upload Photo'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}