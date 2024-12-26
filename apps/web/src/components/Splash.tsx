import { ReactNode } from 'react'
import { bindStyles } from '../utils/browser'
import styles from './Splash.module.css'

const cx = bindStyles(styles)

type SplashProps = {
  children?: ReactNode
  title?: ReactNode
}

export function Splash(props: SplashProps) {
  const { children, title } = props

  return (
    <>
      <div className={cx('splash', 'center')}>
        <div className={cx('stack')}>
          {children && <div className={cx('content')}>{children}</div>}
          {title && <h1 className={cx('title')}>{title}</h1>}
        </div>
      </div>
    </>
  )
}
