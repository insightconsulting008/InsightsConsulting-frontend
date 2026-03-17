import axiosInstance from '@src/providers/axiosInstance'
import React, { useEffect, useState } from 'react'

export default function Notifications() {
  const employeeId = localStorage.getItem("employeeId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingRead, setMarkingRead] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/notifications/employee/${employeeId}`);
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    if (markingRead[notificationId]) return;
    try {
      setMarkingRead(prev => ({ ...prev, [notificationId]: true }));
      await axiosInstance.put(`/notifications/read/${notificationId}`);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    } finally {
      setMarkingRead(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markAsRead(n.notificationId)));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Icon map based on title keywords
  const getIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('assign')) return (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
    if (t.includes('update') || t.includes('amend')) return (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    );
    return (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--neutral-50)', fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: 'var(--primary-100)' }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-700" style={{ color: 'var(--neutral-900)', fontWeight: 700 }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-500 px-4 py-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-primary)',
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-100)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-50)'}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse"
                style={{ background: 'var(--neutral-100)', height: 88 }}
              />
            ))}
          </div>
        ) : error ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'var(--error-50)', border: '1px solid var(--error-100)' }}
          >
            <p style={{ color: 'var(--error-600)' }}>{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-3 text-sm px-4 py-2 rounded-lg"
              style={{ background: 'var(--error-500)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center flex flex-col items-center gap-3"
            style={{ background: 'var(--neutral-0)', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'var(--primary-50)' }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="font-600 text-base" style={{ color: 'var(--neutral-700)', fontWeight: 600 }}>All caught up!</p>
            <p className="text-sm" style={{ color: 'var(--neutral-400)' }}>No notifications yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((notif) => (
              <div
                key={notif.notificationId}
                className="rounded-2xl p-5 flex items-start gap-4 transition-all"
                style={{
                  background: notif.isRead ? 'var(--neutral-0)' : 'var(--primary-50)',
                  border: `1px solid ${notif.isRead ? 'var(--neutral-200)' : 'var(--primary-200)'}`,
                  boxShadow: notif.isRead ? 'var(--shadow-sm)' : 'var(--shadow-md)',
                  transition: 'var(--transition-base)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Unread left accent bar */}
                {!notif.isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: 'var(--color-primary)',
                      borderRadius: '12px 0 0 12px',
                    }}
                  />
                )}

                {/* Icon */}
                <div
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{
                    background: notif.isRead ? 'var(--neutral-100)' : 'var(--primary-100)',
                    color: notif.isRead ? 'var(--neutral-500)' : 'var(--color-primary)',
                  }}
                >
                  {getIcon(notif.title)}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-sm"
                      style={{
                        color: 'var(--neutral-900)',
                        fontWeight: notif.isRead ? 400 : 600,
                        lineHeight: 1.4,
                      }}
                    >
                      {notif.title}
                    </p>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{ color: 'var(--neutral-400)', marginTop: 2 }}
                    >
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--neutral-500)', lineHeight: 1.5 }}
                  >
                    {notif.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {notif.redirectUrl && (
                      <a
                        href={notif.redirectUrl}
                        className="text-xs font-500 flex items-center gap-1"
                        style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}
                        onClick={() => !notif.isRead && markAsRead(notif.notificationId)}
                      >
                        View details
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    )}

                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.notificationId)}
                        disabled={markingRead[notif.notificationId]}
                        className="text-xs flex items-center gap-1"
                        style={{
                          color: 'var(--neutral-400)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          fontFamily: 'var(--font-sans)',
                          transition: 'var(--transition-fast)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--neutral-400)'}
                      >
                        {markingRead[notif.notificationId] ? (
                          <svg className="animate-spin" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" d="M12 2a10 10 0 0110 10" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        Mark as read
                      </button>
                    )}

                    {notif.isRead && (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: 'var(--success-600)' }}
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}