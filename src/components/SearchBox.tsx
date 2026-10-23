// Plain GET form: works without JavaScript and gives shareable /search?q= URLs.
export function SearchBox({ defaultValue = '', className = '' }: { defaultValue?: string; className?: string }) {
  return (
    <form action="/search" role="search" className={`relative ${className}`}>
      <label htmlFor="site-search" className="sr-only">
        Search crackers
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search sparklers, flower pots, sky shots…"
        autoComplete="off"
        className="h-11 w-full rounded-full border border-white/25 bg-white/10 pl-5 pr-14 text-sm text-white placeholder:text-white/70 focus:border-gold-400 focus:bg-white focus:text-ink focus:placeholder:text-muted focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-brand-950 hover:bg-gold-300"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  )
}
