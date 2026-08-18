import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  Instagram,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'

export default function ContactHover() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <Link
        to='/contact'
        className='text-white hover:text-gray-300 transition-colors font-medium tracking-wide text-sm uppercase'
      >
        Contact
      </Link>

      {/* Popover */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Arrow */}
        <div className='absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 border-l border-t border-gray-800 rotate-45' />

        {/* Card */}
        <div className='relative bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl'>
          <p className='text-xs text-gray-400 mb-3 px-2'>QUICK CONTACT</p>

          <div className='space-y-1'>
            <a
              href={`mailto:${import.meta.env.VITE_GMAIL_ACCOUNT}`}
              className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group'
            >
              <Mail
                size={16}
                className='text-gray-400 group-hover:text-white'
              />
              <span className='text-sm text-white'>Email us</span>
              <ArrowRight
                size={14}
                className='ml-auto text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all'
              />
            </a>

            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group'
            >
              <MessageCircle
                size={16}
                className='text-gray-400 group-hover:text-white'
              />
              <span className='text-sm text-white'>WhatsApp</span>
              <ArrowRight
                size={14}
                className='ml-auto text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all'
              />
            </a>

            <a
              href={`tel:+${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group'
            >
              <Phone
                size={16}
                className='text-gray-400 group-hover:text-white'
              />
              <span className='text-sm text-white'>Call us</span>
              <ArrowRight
                size={14}
                className='ml-auto text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all'
              />
            </a>

            <a
              href={`https://instagram.com/${import.meta.env.VITE_INSTAGRAM_USERNAME}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group'
            >
              <Instagram
                size={16}
                className='text-gray-400 group-hover:text-white'
              />
              <span className='text-sm text-white'>Instagram</span>
              <ArrowRight
                size={14}
                className='ml-auto text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all'
              />
            </a>
          </div>

          <div className='mt-3 pt-3 border-t border-gray-800'>
            <Link
              to='/contact'
              className='block text-center text-xs text-gray-400 hover:text-white transition-colors py-1'
            >
              View full contact page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}