// admin/components/ui/SearchInput.jsx
import { Search, X } from 'lucide-react'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
}) {
  return (
    <div
      className="flex items-center gap-2 border border-[#D9D2C4] focus-within:border-[#1A1A18] px-3 py-2 transition-colors"
      style={{ backgroundColor: '#F4EFE6' }}
    >
      <Search size={14} className="text-[#8B8577] shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[#1A1A18] placeholder:text-[#B5AE9E] min-w-0"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.1em',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            onClear?.()
          }}
          className="text-[#8B8577] hover:text-[#D4651F] transition-colors shrink-0"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}