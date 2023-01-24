import type { ReactNode } from 'react'
import { bindStyles } from '../core/browser'
import styles from './CopyButton.module.scss'
import { useCopyText } from './hooks/useCopyText'

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

  const { copy, copying, copied } = useCopyText(text)

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
