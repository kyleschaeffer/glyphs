import { bindStyles } from '../core/browser'
import { useToggleFont } from './hooks/useToggleTheme'
import styles from './FontButton.module.scss'

const cx = bindStyles(styles)

export function FontButton() {
  const toggleFont = useToggleFont()

  return (
    <button className={cx('font-btn')} onClick={toggleFont} title="Toggle font (⇧F)">
      Aa
    </button>
  )
}
