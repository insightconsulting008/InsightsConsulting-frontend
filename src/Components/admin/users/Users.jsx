import React, { useState, useEffect, useCallback } from 'react'
import axiosInstance from '@src/providers/axiosInstance'
import PageHeader from '../page-header/PageHeader'

const PROVIDER_CONFIG = {
  GOOGLE: {
    label: 'Google', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100',
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  EMAIL: {
    label: 'Email', bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
  },
}

const AVATAR_COLORS = ['bg-violet-500','bg-rose-500','bg-amber-500','bg-teal-500','bg-sky-500','bg-fuchsia-500','bg-indigo-500']

function Avatar({ user, size = 'md' }) {
  const [err, setErr] = useState(false)
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm'
  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'
  const color = AVATAR_COLORS[(user.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length]

  if (user.photoUrl && !err) {
    return (
      <img
        src={user.photoUrl}
        alt={user.name}
        referrerPolicy="no-referrer"
        onError={() => setErr(true)}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}
      />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full ${color} flex items-center justify-center text-white font-bold flex-shrink-0 ring-2 ring-white shadow-sm`}>
      {initials}
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-neutral-100 last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-3.5 bg-neutral-100 rounded-full w-28" />
            <div className="h-2.5 bg-neutral-100 rounded-full w-20" />
          </div>
        </div>
      </td>
      {[180, 100, 80, 70, 90].map((w, i) => (
        <td key={i} className="px-5 py-4"><div className="h-3.5 bg-neutral-100 rounded-full" style={{ width: w }} /></td>
      ))}
    </tr>
  )
}

export default function Users() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [order, setOrder]       = useState('desc')
  const [page, setPage]         = useState(1)
  const limit = 10
  const [meta, setMeta]         = useState({ total: 0, totalPages: 1 })

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(search); setPage(1) }, 420)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => { setPage(1) }, [order])

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ page, limit, order })
      if (debouncedQ.trim()) params.set('search', debouncedQ.trim())
      const res = await axiosInstance.get(`/users?${params}`)
      setUsers(res.data.users || [])
      setMeta({
        total: res.data.pagination?.total ?? 0,
        totalPages: res.data.pagination?.totalPages ?? 1,
      })
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, debouncedQ, order])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, meta.total)

  const pageNums = () => {
    const t = meta.totalPages
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '…', t]
    if (page >= t - 3) return [1, '…', t-4, t-3, t-2, t-1, t]
    return [1, '…', page-1, page, page+1, '…', t]
  }

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: 'var(--font-sans, DM Sans, sans-serif)' }}>
      <PageHeader
        title="Users"
        subtitle={!loading && meta.total > 0 ? `${meta.total} registered user${meta.total !== 1 ? 's' : ''}` : 'User management'}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* ── Filter Bar ── */}
        <div className="mb-5 flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-800 placeholder-neutral-400 shadow-sm outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          {/* Sort toggle button */}
          <button
            onClick={() => setOrder(o => o === 'desc' ? 'asc' : 'desc')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-sm whitespace-nowrap ${
              order === 'asc'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary hover:text-primary'
            }`}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${order === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
            </svg>
            {order === 'asc' ? 'Oldest first' : 'Newest first'}
          </button>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="flex-1">{error}</span>
            <button onClick={fetchUsers} className="font-semibold underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden" style={{ boxShadow: '0 4px 20px -4px rgb(104 105 172 / 0.1)' }}>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/80">
                  {['User', 'Email', 'Phone', 'Provider', 'Role', 'Joined'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)
                  : users.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center">
                              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                              </svg>
                            </div>
                            <p className="font-semibold text-neutral-700">No users found</p>
                            {debouncedQ && <button onClick={() => setSearch('')} className="text-sm text-primary font-medium hover:underline">Clear search</button>}
                          </div>
                        </td>
                      </tr>
                    )
                    : users.map((user, idx) => {
                      const pc = PROVIDER_CONFIG[user.provider] || PROVIDER_CONFIG.EMAIL
                      return (
                        <tr
                          key={user.userId}
                          className={`border-b border-neutral-100 last:border-0 hover:bg-primary-50/40 transition-colors ${idx % 2 !== 0 ? 'bg-neutral-50/30' : ''}`}
                        >
                          {/* User cell */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar user={user} />
                              <div className="min-w-0">
                                <p className="font-semibold text-neutral-800 truncate max-w-[130px]">{user.name || '—'}</p>
                                <p className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-[130px]">{user.userId}</p>
                              </div>
                            </div>
                          </td>
                          {/* Email */}
                          <td className="px-5 py-3.5 text-neutral-600 max-w-[200px]">
                            <span className="truncate block">{user.email}</span>
                          </td>
                          {/* Phone */}
                          <td className="px-5 py-3.5">
                            {user.phoneNumber
                              ? <span className="text-neutral-600">{user.phoneNumber}</span>
                              : <span className="text-neutral-300 text-xs italic">—</span>
                            }
                          </td>
                          {/* Provider */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${pc.bg} ${pc.text} ${pc.border}`}>
                              {pc.icon}{pc.label}
                            </span>
                          </td>
                          {/* Role */}
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              user.role === 'ADMIN'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          {/* Joined */}
                          <td className="px-5 py-3.5 text-neutral-500 text-xs whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-neutral-100">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-neutral-100 rounded-full w-1/3" />
                    <div className="h-3 bg-neutral-100 rounded-full w-2/3" />
                    <div className="h-3 bg-neutral-100 rounded-full w-1/2" />
                  </div>
                </div>
              ))
              : users.length === 0
                ? (
                  <div className="py-14 text-center">
                    <p className="text-neutral-500 text-sm font-medium">No users found</p>
                    {debouncedQ && <button onClick={() => setSearch('')} className="mt-2 text-sm text-primary font-medium hover:underline block mx-auto">Clear search</button>}
                  </div>
                )
                : users.map(user => {
                  const pc = PROVIDER_CONFIG[user.provider] || PROVIDER_CONFIG.EMAIL
                  return (
                    <div key={user.userId} className="p-4 hover:bg-primary-50/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar user={user} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-neutral-800 truncate">{user.name || '—'}</p>
                              <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${pc.bg} ${pc.text} ${pc.border}`}>
                              {pc.icon}{pc.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {user.phoneNumber && <span className="text-xs text-neutral-500">{user.phoneNumber}</span>}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              user.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-100'
                            }`}>{user.role}</span>
                            <span className="text-xs text-neutral-400 ml-auto">
                              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
            }
          </div>

          {/* ── Pagination ── */}
          {!loading && meta.total > 0 && (
            <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-neutral-500 order-2 sm:order-1">
                Showing <span className="font-semibold text-neutral-700">{from}–{to}</span> of <span className="font-semibold text-neutral-700">{meta.total}</span> users
              </p>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>

                {pageNums().map((pg, i) =>
                  pg === '…'
                    ? <span key={`e${i}`} className="h-8 w-6 flex items-center justify-center text-neutral-400 text-xs">…</span>
                    : (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`h-8 w-8 rounded-lg text-sm font-semibold transition-all ${
                          pg === page
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {pg}
                      </button>
                    )
                )}

                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="h-8 w-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-500 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}