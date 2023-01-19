import { MouseEvent, ReactNode, useCallback, useRef, useState } from 'react'

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
    <button className={`copy${copied ? ' copied' : ''}`} onClick={copy} disabled={loading}>
      <span>
        {copied && <span className="copied-icon">{copiedIcon}</span>}
        <span className="copy-icon">{copyIcon}</span>
      </span>
      {!hideLabel && (
        <span>
          {copied && <span className="copied-label">{copiedLabel}</span>}
          <span className="copy-label">{copyLabel}</span>
        </span>
      )}
    </button>
  )
}
