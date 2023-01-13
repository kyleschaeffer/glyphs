import { useCallback } from 'react'
import { useAppStore } from '../store/app'

export function Glyph() {
  const glyph = useAppStore((store) => store.glyph)

  const setGlyph = useAppStore((store) => store.setGlyph)

  const close = useCallback(() => setGlyph(null), [setGlyph])

  if (!glyph) return <div>Not found</div>

  return (
    <div className="glyph">
      <button className="close" onClick={close}>
        ╳
      </button>
      <h2 className="name">{glyph.n}</h2>
      <h1 className="char">
        <span className="char-inner">{glyph.c}</span>
      </h1>
      {glyph.g && <p>{glyph.g}</p>}
      {glyph.k && <p>{glyph.k}</p>}
      <p>{glyph.d}</p>
      <p>{glyph.u}</p>
      {glyph.e && <p>{glyph.e}</p>}
      {glyph.v && <p>Added in Unicode version {glyph.v}.0</p>}
    </div>
  )
}
