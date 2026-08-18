import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { api } from '../../lib/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Mail, Send, Bold, Italic, List, Trash2, Loader2 } from 'lucide-react'

// ─── MANWE Design Primitives ─────────────────────────────────────────────────

function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#2D5A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#D4651F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#1A1A18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#2D5A2E" />
      <circle cx="44" cy="28" r="1.5" fill="#D4651F" />
      <path d="M37 18 L40 8 L43 18" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="40" y1="55" x2="40" y2="70" stroke="#1A1A18" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="#1A1A18" opacity="0.7" />
    </svg>
  )
}

function AdinkraDiamond({ size = 6, fill = '#D4651F', opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ opacity }}>
      <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={fill} />
    </svg>
  )
}

function ManweGradientText({ children, fontSize = '32px', letterSpacing = '0.05em' }) {
  return (
    <span
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize,
        letterSpacing,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #2D5A2E 0%, #4A8C4D 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-px bg-[#2D5A2E]" />
      <AdinkraDiamond size={6} fill="#D4651F" />
      <span
        className="text-[#2D5A2E]"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.4em',
        }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  )
}

function FlagStrip({ className = 'w-full h-0.5' }) {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-1">
        <div className="flex-1 bg-[#2D5A2E]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
      <div className="w-px" />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#D4651F]" />
        <div className="flex-1 bg-[#F4EFE6]" />
        <div className="flex-1 bg-[#2D5A2E]" />
      </div>
    </div>
  )
}

const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'top-center',
    autoClose: 3000,
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '13px',
      letterSpacing: '0.25em',
      backgroundColor: '#FDFAF3',
      color: type === 'success' ? '#2D5A2E' : '#D4651F',
      border: `1px solid ${type === 'success' ? '#2D5A2E' : '#D4651F'}`,
      borderRadius: 0,
    },
  })
}

function ManweLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      <div style={{ animation: 'manwe-spin 3s linear infinite' }}>
        <ManweBeastEmblem size={64} opacity={0.9} />
      </div>
      <p
        className="text-[#6B6558]"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '14px',
          letterSpacing: '0.4em',
        }}
      >
        LOADING SIGNAL
      </p>
      <style>{`
        @keyframes manwe-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ─── Newsletter Page ─────────────────────────────────────────────────────────

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(true)
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [deletingEmail, setDeletingEmail] = useState(null)
  const [error, setError] = useState(null)
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: true })

      if (fetchError) throw fetchError
      setSubscribers(data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load subscribers.')
    } finally {
      setLoadingSubscribers(false)
    }
  }

  const handleSendNewsletter = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !content.trim()) {
      showToast('SUBJECT AND CONTENT REQUIRED', 'error')
      return
    }

    const recipients = subscribers.map((s) => s.email)
    if (recipients.length === 0) {
      showToast('NO SUBSCRIBERS TO SEND TO', 'error')
      return
    }

    if (!window.confirm(`Send this signal to ${recipients.length} subscriber(s)?`)) {
      return
    }

    setSendingNewsletter(true)
    try {
      await api.post('/send-email', {
        type: 'newsletter',
        subject,
        content,
        recipients,
      })

      showToast(`SIGNAL SENT TO ${recipients.length} MEMBERS`)
      setSubject('')
      setContent('')
    } catch (err) {
      console.error(err)
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Failed to send signal.'
      showToast(msg.toUpperCase(), 'error')
    } finally {
      setSendingNewsletter(false)
    }
  }

  const handleDeleteSubscriber = async (email) => {
    if (!window.confirm(`Remove ${email} from the tribe?`)) return

    setDeletingEmail(email)
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', email)

      if (error) throw error

      setSubscribers((prev) => prev.filter((s) => s.email !== email))
      showToast('SUBSCRIBER REMOVED')
    } catch (err) {
      console.error(err)
      showToast('FAILED TO REMOVE', 'error')
    } finally {
      setDeletingEmail(null)
    }
  }

  const applyFormatting = (tag) => {
    const textarea = document.getElementById('content-textarea')
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const tags = {
      b: `<b>${selected}</b>`,
      i: `<i>${selected}</i>`,
      ul: `<ul>\n  <li>${selected}</li>\n</ul>`,
    }
    const newContent =
      content.substring(0, start) + tags[tag] + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      const newPos = start + tags[tag].length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  return (
    <div
      className="min-h-screen pt-8 pb-16 relative overflow-hidden"
      style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}
    >
      {/* Background watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.03} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-px bg-[#2D5A2E]" />
            <AdinkraDiamond size={6} fill="#D4651F" />
            <span
              className="text-[#2D5A2E]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.4em',
              }}
            >
              REACH THE TRIBE
            </span>
            <AdinkraDiamond size={6} fill="#D4651F" />
            <div className="w-4 h-px bg-[#D4651F]" />
          </div>

          <h1
            className="leading-none mb-2"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              letterSpacing: '0.02em',
            }}
          >
            <ManweGradientText fontSize="clamp(32px, 5vw, 48px)" letterSpacing="0.02em">
              THE SIGNAL
            </ManweGradientText>
          </h1>

          <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
            {subscribers.length} {subscribers.length === 1 ? 'SUBSCRIBER' : 'SUBSCRIBERS'}
          </p>
        </div>

        {/* ── Send Form ── */}
        <div
          className="relative border border-[#D9D2C4] p-6 mb-6"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

          <SectionLabel>COMPOSE SIGNAL</SectionLabel>

          <form onSubmit={handleSendNewsletter} className="space-y-5">
            {/* Subject */}
            <div>
              <label
                className="text-[#6B6558] flex items-center gap-2 mb-2"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                }}
              >
                SUBJECT
                <AdinkraDiamond size={4} fill="#D4651F" />
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Signal subject"
                className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors"
                style={{
                  backgroundColor: '#F4EFE6',
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '15px',
                  letterSpacing: '0.1em',
                }}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label
                className="text-[#6B6558] flex items-center gap-2 mb-2"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                }}
              >
                CONTENT
                <AdinkraDiamond size={4} fill="#D4651F" />
              </label>

              {/* Formatting toolbar */}
              <div className="flex gap-2 mb-2">
                {[
                  { tag: 'b', icon: <Bold size={14} />, title: 'Bold' },
                  { tag: 'i', icon: <Italic size={14} />, title: 'Italic' },
                  { tag: 'ul', icon: <List size={14} />, title: 'List' },
                ].map(({ tag, icon, title }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => applyFormatting(tag)}
                    className="border border-[#D9D2C4] hover:border-[#1A1A18] p-2 text-[#6B6558] hover:text-[#1A1A18] transition-colors"
                    style={{ backgroundColor: '#F4EFE6' }}
                    title={title}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <textarea
                id="content-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the signal... (HTML supported)"
                rows="10"
                className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors font-mono text-sm resize-y"
                style={{
                  backgroundColor: '#F4EFE6',
                  letterSpacing: '0.02em',
                }}
                required
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={sendingNewsletter || subscribers.length === 0}
              className={`
                group relative flex items-center justify-center gap-4 border px-8 py-4 transition-all duration-300 w-full
                ${
                  sendingNewsletter || subscribers.length === 0
                    ? 'border-[#D9D2C4] cursor-not-allowed opacity-50'
                    : 'border-[#1A1A18]/40 hover:border-[#1A1A18] hover:bg-[#1A1A18]'
                }
              `}
            >
              {!sendingNewsletter && subscribers.length > 0 && (
                <>
                  <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
                  <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
                  <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
                  <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
                </>
              )}

              {sendingNewsletter ? (
                <Loader2 size={16} className="animate-spin text-[#8B8577]" />
              ) : (
                <Send size={14} className="text-[#1A1A18] group-hover:text-[#F4EFE6] transition-colors" />
              )}

              <span
                className={`transition-colors ${
                  sendingNewsletter || subscribers.length === 0
                    ? 'text-[#8B8577]'
                    : 'text-[#1A1A18] group-hover:text-[#F4EFE6]'
                }`}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '14px',
                  letterSpacing: '0.35em',
                }}
              >
                {sendingNewsletter
                  ? 'SENDING SIGNAL...'
                  : `SEND TO ${subscribers.length} ${subscribers.length === 1 ? 'MEMBER' : 'MEMBERS'}`}
              </span>
            </button>
          </form>
        </div>

        {/* ── Preview ── */}
        <div
          className="relative border border-[#D9D2C4] p-6 mb-6"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <SectionLabel>PREVIEW</SectionLabel>
          {content ? (
            <div
              className="border border-[#D9D2C4] p-4 prose max-w-none text-[#1A1A18]"
              style={{ backgroundColor: '#F4EFE6' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-[#8B8577] italic text-sm">
              Write content above to see the preview...
            </p>
          )}
        </div>

        {/* ── Subscribers List ── */}
        <div
          className="relative border border-[#D9D2C4] p-6"
          style={{ backgroundColor: '#FDFAF3' }}
        >
          <SectionLabel>SUBSCRIBERS</SectionLabel>

          {loadingSubscribers ? (
            <div className="flex justify-center py-8">
              <div style={{ animation: 'manwe-spin 3s linear infinite' }}>
                <ManweBeastEmblem size={40} opacity={0.7} />
              </div>
            </div>
          ) : error ? (
            <p className="text-center text-[#D4651F] py-4 text-sm">{error}</p>
          ) : subscribers.length > 0 ? (
            <div
              className="border border-[#D9D2C4] max-h-96 overflow-y-auto divide-y divide-[#D9D2C4]"
              style={{ backgroundColor: '#F4EFE6' }}
            >
              {subscribers.map((sub) => (
                <div
                  key={sub.email}
                  className="p-3 flex justify-between items-center hover:bg-[#FDFAF3] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AdinkraDiamond size={5} fill="#2D5A2E" opacity={0.8} />
                    <span
                      className="text-[#1A1A18] truncate"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '13px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {sub.email}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubscriber(sub.email)}
                    disabled={deletingEmail === sub.email}
                    className="text-[#8B8577] hover:text-[#D4651F] transition-colors ml-2 shrink-0 disabled:opacity-50"
                    title="Remove subscriber"
                  >
                    {deletingEmail === sub.email ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Mail size={32} className="text-[#B5AE9E]" />
              <p
                className="text-[#8B8577]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '13px',
                  letterSpacing: '0.3em',
                }}
              >
                NO SUBSCRIBERS YET
              </p>
            </div>
          )}
        </div>

        {/* Bottom flag strip */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">
            NGR × CIV
          </span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}