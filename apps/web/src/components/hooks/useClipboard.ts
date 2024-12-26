import { KeyboardEvent, MouseEvent, useCallback, useMemo, useRef, useState } from 'react'

export function useClipboard(text: string, copiedTimeMs: number = 3000) {
  const [copying, setCopying] = useState(false)
  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (e?: MouseEvent | KeyboardEvent) => {
      e?.preventDefault()

      setCopying(true)
      try {
        await navigator.clipboard?.writeText(text)
        setCopied(true)

        if (copiedTimerRef.current !== null) {
          clearTimeout(copiedTimerRef.current)
        }
        copiedTimerRef.current = setTimeout(() => setCopied(false), copiedTimeMs)
      } catch (e) {
        console.warn('Failed to copy', e)
      } finally {
        setCopying(false)
      }
    },
    [copiedTimeMs, text]
  )

  return useMemo(
    () => ({
      copy,
      copying,
      copied,
    }),
    [copy, copying, copied]
  )
}
