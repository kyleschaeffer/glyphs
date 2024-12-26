import { escapeSingleQuotes } from '@glyphs/core'
import { decodeHtml } from '../utils/browser'

type CharacterProps = {
  children: string
  escape?: boolean
}

export function Character({ children, escape }: CharacterProps) {
  return <>{escape ? escapeSingleQuotes(decodeHtml(children)) : decodeHtml(children)}</>
}
