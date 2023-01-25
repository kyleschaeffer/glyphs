import Link from 'next/link'
import { bindStyles } from '../core/browser'
import { useAppStore } from '../store/app'
import styles from './Summary.module.scss'
import { ThemeButton } from './ThemeButton'

const cx = bindStyles(styles)

const UNICODE_VERSION = process.env.NEXT_PUBLIC_UNICODE_VERSION || ''

export function Summary() {
  const ready = useAppStore((store) => store.ready)
  const glyphCount = useAppStore((store) => store.count)

  if (!ready) return null

  return (
    <footer className={cx('summary')}>
      <p>
        Searching <strong>{glyphCount.toLocaleString()}</strong> glyphs in Unicode{' '}
        <Link href={`https://www.unicode.org/versions/Unicode${UNICODE_VERSION}.0/`} target="_blank">
          <span>{UNICODE_VERSION}.0</span>
          <span> ↗</span>
        </Link>{' '}
        <ThemeButton />
      </p>
    </footer>
  )
}
