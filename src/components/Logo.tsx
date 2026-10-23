import Link from 'next/link'

// Firework burst mark: the shape used across the site's decorations.
export function BurstIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          return (
            <line
              key={i}
              x1={20 + Math.cos(a) * 7}
              y1={20 + Math.sin(a) * 7}
              x2={20 + Math.cos(a) * 17}
              y2={20 + Math.sin(a) * 17}
            />
          )
        })}
      </g>
      <circle cx="20" cy="20" r="4" fill="currentColor" />
    </svg>
  )
}

export function Logo({ name }: { name: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 text-white" aria-label={`${name} home`}>
      <BurstIcon className="h-8 w-8 text-gold-400 sm:h-9 sm:w-9" />
      <span className="font-display text-xl font-bold leading-none whitespace-nowrap sm:text-2xl">{name}</span>
    </Link>
  )
}
