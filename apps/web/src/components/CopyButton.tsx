import type { ReactNode } from 'react'
import { bindStyles } from '../utils/browser'
import styles from './CopyButton.module.css'
import { useClipboard } from './hooks/useClipboard'

const cx = bindStyles(styles)

type CopyButtonProps = {
  copiedIcon?: ReactNode
  copiedLabel?: ReactNode
  copyIcon?: ReactNode
  copyLabel?: ReactNode
  hideLabel?: boolean
  text: string
}

export function CopyButton(props: CopyButtonProps) {
  const { copiedIcon = '✓', copiedLabel = 'Copied', copyIcon = '⧉', copyLabel = 'Copy Text', hideLabel, text } = props

  const { copy, copying, copied } = useClipboard(text)

  return (
    <button className={cx('copy', { copied })} onClick={copy} disabled={copying}>
      <span>
        {copied && <span className={cx('copied-icon')}>{copiedIcon}</span>}
        <span className={cx('icon')}>{copyIcon}</span>
      </span>
      {!hideLabel && (
        <span>
          {copied && <span className={cx('copied-label')}>{copiedLabel}</span>}
          <span className={cx('label')}>{copyLabel}</span>
        </span>
      )}
    </button>
  )
}
