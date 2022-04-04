import { Component, createSignal, Match, Switch } from 'solid-js'

export type CopyButtonProps = {
  copyText: string
  errorMessage?: string
  promptMessage?: string
  successMessage?: string
  successTimeoutMs?: number
}

export const CopyButton: Component<CopyButtonProps> = (props) => {
  const {
    children,
    copyText,
    errorMessage = 'Failed to copy',
    promptMessage = 'Copy value',
    successMessage = 'Copied',
    successTimeoutMs = 1500,
  } = props

  const [message, setMessage] = createSignal<'error' | 'prompt' | 'success'>('prompt')

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setMessage('success')
      setTimeout(() => setMessage('prompt'), successTimeoutMs)
    } catch (e) {
      setMessage('error')
      setTimeout(() => setMessage('prompt'), successTimeoutMs)
    }
  }

  return (
    <button class="copy-btn" onClick={onCopy}>
      {children}
      <div class={`tooltip ${message()}`}>
        <Switch>
          <Match when={message() === 'prompt'}>⧉ {promptMessage}</Match>
          <Match when={message() === 'success'}>✓ {successMessage}</Match>
          <Match when={message() === 'error'}>✗ {errorMessage}</Match>
        </Switch>
      </div>
    </button>
  )
}
