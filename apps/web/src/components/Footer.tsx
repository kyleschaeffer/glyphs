import { DEFAULT_UNICODE_VERSION } from '@glyphs/core'
import { useAppStore } from '../store/app'
import { bindStyles } from '../utils/browser'
import styles from './Footer.module.css'
import { ThemeButtons } from './ThemeButtons'

const cx = bindStyles(styles)

export function Footer() {
  const count = useAppStore((store) => store.glyphCount)

  return (
    <footer className={cx('footer')}>
      <p>
        Searching <strong>{count.toLocaleString()}</strong> glyphs in Unicode{' '}
        <a href={`https://www.unicode.org/versions/Unicode${DEFAULT_UNICODE_VERSION}.0/`} target="_blank">
          <span>{DEFAULT_UNICODE_VERSION}</span>
          <span> ↗</span>
        </a>{' '}
      </p>
      <ThemeButtons />
    </footer>
  )
}
