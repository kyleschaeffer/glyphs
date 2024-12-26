import { bindStyles } from '../utils/browser'
import { Character } from './Character'
import styles from './CharacterCanvas.module.css'

const cx = bindStyles(styles)

type CharacterCanvasProps = {
  children: string
}

export function CharacterCanvas(props: CharacterCanvasProps) {
  const { children } = props

  return (
    <h1 className={cx('char')}>
      <span className={cx('char-inner')}>
        <Character>{children}</Character>
      </span>
      <span className={cx('char-measure')}>
        <span className={cx('measure', 'measure-width')}>
          <span className={cx('tick', 'tick1')} />
          <span className={cx('measure-width-value')}> em</span>
          <span className={cx('tick', 'tick2')} />
        </span>
        <span className={cx('measure', 'measure-height')}>
          <span className={cx('tick', 'tick1')} />
          <span className={cx('measure-height-value')}>1 em</span>
          <span className={cx('tick', 'tick2')} />
        </span>
      </span>
    </h1>
  )
}
