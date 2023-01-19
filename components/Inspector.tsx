import { useAppStore } from '../store/app'

export function Inspector() {
  const inspect = useAppStore((store) => store.inspect)

  return (
    <ul className="inspector">
      {inspect.map((c, i) => (
        <li key={i}>
          {!c && 'Unknown glyph'}
          {c && c.c}
        </li>
      ))}
    </ul>
  )
}
