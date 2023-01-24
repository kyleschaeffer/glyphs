import { ReactNode } from 'react'
import { bindStyles } from '../core/browser'
import styles from './Character.module.scss'

const cx = bindStyles(styles)

type CharacterProps = {
  children?: ReactNode
}

export function Character(props: CharacterProps) {
  const { children } = props

  return (
    <h1 className={cx('char')}>
      <span className={cx('char-inner')}>{children}</span>
      <span className={cx('char-measure')}>
        <span className={cx('measure', 'measure-width')}>
          <span className={cx('tick', 'tick1')} />
          <span className={cx('measure-value')}> em</span>
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
