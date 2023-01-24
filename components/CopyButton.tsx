import { MouseEvent, ReactNode, useCallback, useRef, useState } from 'react'
import { bindStyles } from '../core/browser'
import styles from './CopyButton.module.scss'

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

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const copy = useCallback(
    async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault()

      setLoading(true)
      try {
        await navigator.clipboard?.writeText(text)
        setCopied(true)

        clearTimeout(copiedTimerRef.current)
        copiedTimerRef.current = setTimeout(() => setCopied(false), 3000)
      } catch (e) {
        console.warn('Failed to copy', e)
      } finally {
        setLoading(false)
      }
    },
    [text]
  )

  return (
    <button className={cx('copy', { copied })} onClick={copy} disabled={loading}>
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
