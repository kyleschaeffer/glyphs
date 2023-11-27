import Link from 'next/link'
import { Search } from '../components/Search'
import { useAppStore } from '../store/app'

export default function SearchRoute() {
  const hasQuery = useAppStore((store) => store.query.length > 0)
  const blocks = useAppStore((store) => store.blocks)
  const scripts = useAppStore((store) => store.scripts)

  return (
    <>
      <Search />
      {!hasQuery && (
        <>
          <ol>
            {scripts.map(([slug, label]) => (
              <li key={slug}>
                <Link href={`/script/${slug}`}>Script: {label}</Link>
              </li>
            ))}
          </ol>
          <ol>
            {blocks.map(([slug, label]) => (
              <li key={slug}>
                <Link href={`/block/${slug}`}>Block: {label}</Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  )
}
