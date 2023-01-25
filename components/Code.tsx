import { bindStyles } from '../core/browser'
import { useCopyText } from './hooks/useCopyText'
import styles from './Code.module.scss'
import { CSSProperties, useMemo } from 'react'
import { escapeSingleQuotes } from '../core/convert'

const cx = bindStyles(styles)

type CodeProps = {
  children?: string
  copyText?: string
  prefix?: string
  suffix?: string
  wrap?: boolean
}

export function Code(props: CodeProps) {
  const { children, copyText = children, prefix, suffix, wrap } = props

  const { copy, copied } = useCopyText(copyText ?? '')

  const codeStyle = useMemo<CSSProperties | undefined>(
    () => ({
      ['--prefix' as string]: prefix ? `'${escapeSingleQuotes(prefix)}'` : undefined,
      ['--suffix' as string]: suffix ? `'${escapeSingleQuotes(suffix)}'` : undefined,
    }),
    [prefix, suffix]
  )

  return (
    <button className={cx('btn')} onClick={copy}>
      <code className={cx('code', { wrap, ['with-prefix']: !!prefix, ['with-suffix']: !!suffix })} style={codeStyle}>
        {children}
        {copied && (
          <span className={cx('copied')}>
            <span className={cx('icon')}>✓</span>
            <span>Copied</span>
          </span>
        )}
      </code>
    </button>
  )
}
