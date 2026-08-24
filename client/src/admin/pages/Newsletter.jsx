// Newsletter.jsx — MANWE Admin · The Signal
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { api } from '../../lib/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Mail, Send, Bold, Italic, List, Trash2, RefreshCcw } from 'lucide-react'

import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import SearchInput from '../components/ui/SearchInput'
import { SkeletonBox } from '../components/ui/Skeleton'

// ─── Design primitives ───────────────────────────────────────────────────────

function ManweBeastEmblem({ size = 60, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="#2D5A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="#D4651F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="#1A1A18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="#1A1A18" strokeWidth="1.5" fill="none" />
      <circle cx="36" cy="28" r="1.5" fill="#2D5A2E" />
      <circle cx="44" cy="28" r="1.5" fill="#D4651F" />
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
        fontFamily: "'Bebas Neue', sans-serif", fontSize, letterSpacing, lineHeight: 1,
        background: 'linear-gradient(135deg, #2D5A2E 0%, #4A8C4D 25%, #1A1A18 50%, #D4651F 75%, #C4541A 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-px bg-[#2D5A2E]" /><AdinkraDiamond size={6} fill="#D4651F" />
      <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}>
        {children}
      </span>
      <div className="flex-1 h-px bg-[#D9D2C4]" />
    </div>
  )
}

function FlagStrip({ className = 'w-full h-0.5' }) {
  return (
    <div className={`${className} flex`}>
      <div className="flex flex-1"><div className="flex-1 bg-[#2D5A2E]" /><div className="flex-1 bg-[#F4EFE6]" /><div className="flex-1 bg-[#2D5A2E]" /></div>
      <div className="w-px" />
      <div className="flex flex-1"><div className="flex-1 bg-[#D4651F]" /><div className="flex-1 bg-[#F4EFE6]" /><div className="flex-1 bg-[#2D5A2E]" /></div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const showToast = (message, type = 'success') => {
  toast[type](message, {
    position: 'bottom-right', autoClose: 3000,
    style: {
      fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.25em',
      backgroundColor: '#FDFAF3', color: type === 'success' ? '#2D5A2E' : '#D4651F',
      border: `1px solid ${type === 'success' ? '#2D5A2E' : '#D4651F'}`, borderRadius: 0,
    },
  })
}

function mapAccessError(err) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('permission') || msg.includes('row-level security') || msg.includes('jwt')) {
    return 'ACCESS DENIED — CHECK ADMIN ROLE OR NEWSLETTER RLS'
  }
  return (err?.message || 'FAILED TO LOAD SUBSCRIBERS').toUpperCase()
}

function escapePreviewHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [deletingEmail, setDeletingEmail] = useState(null)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState('compose') // compose | preview

  const textareaRef = useRef(null)

  const fetchSubscribers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoadingSubscribers(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('email, subscribed_at')
        .order('subscribed_at', { ascending: false })

      if (fetchError) throw fetchError
      setSubscribers(data || [])
    } catch (err) {
      console.error(err)
      setError(mapAccessError(err))
    } finally {
      setLoadingSubscribers(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const filteredSubscribers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return subscribers
    return subscribers.filter(s => s.email.toLowerCase().includes(q))
  }, [subscribers, searchQuery])

  const handleSendNewsletter = async (e) => {
    e.preventDefault()
    if (sendingNewsletter) return

    const cleanSubject = subject.trim()
    const cleanContent = content.trim()

    if (!cleanSubject || !cleanContent) {
      showToast('SUBJECT AND CONTENT REQUIRED', 'error')
      return
    }

    if (cleanSubject.length > 200) {
      showToast('SUBJECT TOO LONG', 'error')
      return
    }

    const recipients = [...new Set(subscribers.map((s) => String(s.email || '').trim().toLowerCase()).filter(Boolean))]

    if (recipients.length === 0) {
      showToast('NO SUBSCRIBERS TO SEND TO', 'error')
      return
    }

    if (!window.confirm(`Send this signal to ${recipients.length} subscriber(s)?\n\nThis cannot be undone.`)) return

    setSendingNewsletter(true)
    try {
      await api.post('/send-email', {
        type: 'newsletter',
        subject: cleanSubject,
        content: cleanContent,
        recipients,
      })

      showToast(`SIGNAL SENT TO ${recipients.length} MEMBERS`)
      setSubject('')
      setContent('')
      setActiveTab('compose')
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.error || err.message || 'Failed to send signal.'
      showToast(String(msg).toUpperCase(), 'error')
    } finally {
      setSendingNewsletter(false)
    }
  }

  const handleDeleteSubscriber = async (email) => {
    if (!email || deletingEmail) return
    if (!window.confirm(`Remove ${email} from the tribe?`)) return

    setDeletingEmail(email)
    try {
      const { error: delError } = await supabase.from('newsletter_subscribers').delete().eq('email', email)
      if (delError) throw delError

      setSubscribers((prev) => prev.filter((s) => s.email !== email))
      showToast('SUBSCRIBER REMOVED')
    } catch (err) {
      console.error(err)
      showToast(mapAccessError(err), 'error')
    } finally {
      setDeletingEmail(null)
    }
  }

  const applyFormatting = (tag) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end) || 'text'
    const tags = {
      b: `<b>${selected}</b>`,
      i: `<i>${selected}</i>`,
      ul: `<ul>\n  <li>${selected}</li>\n</ul>`,
    }
    const snippet = tags[tag]
    if (!snippet) return

    const newContent = content.substring(0, start) + snippet + content.substring(end)
    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()
      const newPos = start + snippet.length
      textarea.setSelectionRange(newPos, newPos)
    })
  }

  return (
    <div className="min-h-screen pt-8 pb-16 relative overflow-hidden" style={{ backgroundColor: '#F4EFE6', color: '#1A1A18' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <ManweBeastEmblem size={500} opacity={0.03} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-px bg-[#2D5A2E]" /><AdinkraDiamond size={6} fill="#D4651F" />
              <span className="text-[#2D5A2E]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.4em' }}>
                REACH THE TRIBE
              </span>
              <AdinkraDiamond size={6} fill="#D4651F" /><div className="w-4 h-px bg-[#D4651F]" />
            </div>

            <h1 className="leading-none mb-2">
              <ManweGradientText fontSize="clamp(32px, 5vw, 48px)">THE SIGNAL</ManweGradientText>
            </h1>
            <p className="font-mono text-[#8B8577] text-[10px] tracking-[0.3em] mt-2">
              {subscribers.length} {subscribers.length === 1 ? 'SUBSCRIBER' : 'SUBSCRIBERS'}
            </p>
          </div>

          <Button variant="secondary" onClick={() => fetchSubscribers(true)} loading={refreshing || loadingSubscribers} icon={RefreshCcw} withDiamonds>
            REFRESH
          </Button>
        </div>

        {/* Compose / Preview Tabs */}
        <div className="flex gap-0 mb-6 border-b border-[#D9D2C4]">
          {['compose', 'preview'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 transition-all ${
                activeTab === tab ? 'text-[#1A1A18]' : 'text-[#8B8577] hover:text-[#1A1A18]'
              }`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.35em' }}
            >
              {tab.toUpperCase()}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#D4651F' }} />}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="relative border border-[#D9D2C4] p-6 mb-8" style={{ backgroundColor: '#FDFAF3' }}>
          <span className="absolute -top-1 -left-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>
          <span className="absolute -top-1 -right-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -left-1"><AdinkraDiamond size={7} fill="#D4651F" /></span>
          <span className="absolute -bottom-1 -right-1"><AdinkraDiamond size={7} fill="#2D5A2E" /></span>

          {activeTab === 'compose' ? (
            <form onSubmit={handleSendNewsletter} className="space-y-5">
              <div>
                <label className="text-[#6B6558] flex items-center gap-2 mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.3em' }}>
                  SUBJECT <AdinkraDiamond size={4} fill="#D4651F" />
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Signal subject"
                  maxLength={200}
                  className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors"
                  style={{ backgroundColor: '#F4EFE6', fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.1em' }}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#6B6558] flex items-center gap-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.3em' }}>
                    CONTENT <AdinkraDiamond size={4} fill="#D4651F" />
                  </label>
                  
                  <div className="flex gap-1">
                    {[
                      { tag: 'b', icon: <Bold size={12} />, title: 'Bold' },
                      { tag: 'i', icon: <Italic size={12} />, title: 'Italic' },
                      { tag: 'ul', icon: <List size={12} />, title: 'List' },
                    ].map(({ tag, icon, title }) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => applyFormatting(tag)}
                        className="border border-[#D9D2C4] hover:border-[#1A1A18] p-1.5 text-[#6B6558] hover:text-[#1A1A18] transition-colors"
                        style={{ backgroundColor: '#F4EFE6' }}
                        title={title}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the signal... (basic HTML supported)"
                  rows={12}
                  className="w-full border border-[#D9D2C4] focus:border-[#1A1A18] outline-none px-4 py-3 text-[#1A1A18] placeholder:text-[#B5AE9E] transition-colors font-mono text-sm resize-y"
                  style={{ backgroundColor: '#F4EFE6', letterSpacing: '0.02em' }}
                  required
                />
              </div>

              <Button
                type="submit"
                fullWidth
                icon={Send}
                loading={sendingNewsletter}
                disabled={subscribers.length === 0}
              >
                SEND TO {subscribers.length} {subscribers.length === 1 ? 'MEMBER' : 'MEMBERS'}
              </Button>
            </form>
          ) : (
            <div>
              <SectionLabel>EMAIL PREVIEW</SectionLabel>
              {content ? (
                <div
                  className="border border-[#D9D2C4] p-6 max-w-none text-[#1A1A18] text-sm leading-relaxed"
                  style={{ backgroundColor: '#F4EFE6' }}
                  dangerouslySetInnerHTML={{ __html: escapePreviewHtml(content) }}
                />
              ) : (
                <div className="text-center py-12 text-[#8B8577] italic text-sm">
                  Write content in the COMPOSE tab to see the preview...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subscribers List */}
        <div className="relative border border-[#D9D2C4] p-6" style={{ backgroundColor: '#FDFAF3' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <SectionLabel>SUBSCRIBERS LIST</SectionLabel>
            <div className="w-full sm:w-64">
              <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search emails..." />
            </div>
          </div>

          {loadingSubscribers ? (
            <div className="space-y-2">
              <SkeletonBox className="h-12 w-full" />
              <SkeletonBox className="h-12 w-full" />
              <SkeletonBox className="h-12 w-full" />
            </div>
          ) : error ? (
            <EmptyState title="SOMETHING WENT WRONG" message={error} actionLabel="TRY AGAIN" onAction={fetchSubscribers} />
          ) : filteredSubscribers.length > 0 ? (
            <div className="border border-[#D9D2C4] max-h-96 overflow-y-auto divide-y divide-[#D9D2C4]" style={{ backgroundColor: '#F4EFE6' }}>
              {filteredSubscribers.map((sub) => (
                <div key={sub.email} className="p-3 flex justify-between items-center hover:bg-[#FDFAF3] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <AdinkraDiamond size={5} fill="#2D5A2E" opacity={0.8} />
                    <span className="text-[#1A1A18] truncate font-mono text-[11px] tracking-wider">
                      {sub.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteSubscriber(sub.email)}
                    loading={deletingEmail === sub.email}
                    className="!text-[#8B8577] hover:!text-[#D4651F] !px-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="NO SUBSCRIBERS FOUND" icon={<Mail size={40} opacity={0.3} />} />
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <FlagStrip className="w-24 h-0.5" />
          <span className="font-mono text-[#B5AE9E] text-[9px] tracking-[0.4em]">NGR × CIV</span>
          <FlagStrip className="w-24 h-0.5" />
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}