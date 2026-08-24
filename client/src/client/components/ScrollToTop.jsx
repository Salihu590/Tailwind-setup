// client/src/client/components/ScrollToTop.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // If navigating to an anchor link (#section), smooth scroll to it
    if (hash) {
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
        }
      })
      return
    }

    // Standard route change → Reset window scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' in window ? 'instant' : 'auto',
    })
  }, [pathname, search, hash])

  return null
}