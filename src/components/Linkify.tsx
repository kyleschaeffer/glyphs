import { Component, createMemo, JSX } from 'solid-js'

export type LinkifyProps = {
  phrase: string
}

const TERM_REGEX = /([\w\d-]+)([^\w\d]*)/gm
const IGNORE_SEARCH_WORDS: string[] = [
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'if',
  'in',
  'is',
  'nor',
  'of',
  'on',
  'or',
  'per',
  'so',
  'the',
  'to',
  'via',
  'was',
  'with',
  'yet',
]

export const Linkify: Component<LinkifyProps> = (props) => {
  const { phrase } = props

  const children = createMemo(() => {
    const children: JSX.Element[] = []
    let match = TERM_REGEX.exec(phrase)
    while (match) {
      const [, term, separator] = match
      children.push(
        IGNORE_SEARCH_WORDS.includes(term.toLowerCase()) ? (
          <span>{term}</span>
        ) : (
          <a href={`#q=${encodeURIComponent(term.toLowerCase())}`}>{term}</a>
        )
      )
      if (separator !== undefined && separator.length) children.push(<span>{separator}</span>)
      match = TERM_REGEX.exec(phrase)
    }
    return children
  })

  return <span>{children()}</span>
}
