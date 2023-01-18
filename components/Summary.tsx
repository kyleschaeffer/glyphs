import Link from 'next/link'
import { useAppStore } from '../store/app'

const UNICODE_VERSION = process.env.NEXT_PUBLIC_UNICODE_VERSION || ''

export function Summary() {
  const ready = useAppStore((store) => store.ready)
  const glyphCount = useAppStore((store) => store.count)

  if (!ready) return null

  return (
    <footer className="summary">
      <p>
        Enter a character or keywords to search <strong>{glyphCount.toLocaleString()}</strong> glyphs in Unicode{' '}
        <Link href={`https://www.unicode.org/versions/Unicode${UNICODE_VERSION}.0/`} target="_blank">
          <span>{UNICODE_VERSION}.0</span>
          <span> ↗</span>
        </Link>
      </p>
    </footer>
  )
}
