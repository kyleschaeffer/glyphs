import { useCallback } from 'react'
import { useAppStore } from '../store/app'

export function Glyph() {
  const glyph = useAppStore((store) => store.glyph)

  const setGlyph = useAppStore((store) => store.setGlyph)

  const close = useCallback(() => setGlyph(null), [setGlyph])

  if (!glyph) return <div>Not found</div>

  return (
    <div>
      <button onClick={close}>╳</button>
      <h1 className="char">{glyph.c}</h1>
      <p>{glyph.n}</p>
      {glyph.g && <p>{glyph.g}</p>}
      {glyph.k && <p>{glyph.k}</p>}
      <p>{glyph.d}</p>
      <p>{glyph.u}</p>
      {glyph.e && <p>{glyph.e}</p>}
      {glyph.v && <p>Added in Unicode version {glyph.v}.0</p>}
    </div>
  )
}
