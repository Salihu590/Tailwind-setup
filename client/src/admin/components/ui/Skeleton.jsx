// admin/components/ui/Skeleton.jsx
// Reusable skeleton loaders — MANWE themed

export function SkeletonBox({ className = '', style = {} }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: '#E8E1D0',
        ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(253, 250, 243, 0.6) 50%, transparent 100%)',
          animation: 'manwe-shimmer 1.6s infinite',
        }}
      />
      <style>{`
        @keyframes manwe-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div
      className="relative border border-[#D9D2C4] p-5 space-y-4"
      style={{ backgroundColor: '#FDFAF3' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonBox className="h-3 w-16" />
          <SkeletonBox className="h-5 w-32" />
        </div>
        <SkeletonBox className="h-6 w-20" />
      </div>
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-5 w-40" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-[#D9D2C4]">
        <SkeletonBox className="h-6 w-24" />
        <SkeletonBox className="h-3 w-16" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-[#D9D2C4]">
      <SkeletonBox className="h-10 w-10 rounded-none" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-3 w-24" />
      </div>
      <SkeletonBox className="h-8 w-20" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}