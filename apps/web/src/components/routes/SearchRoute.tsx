import { NavLink } from 'react-router'
import { useAppStore } from '../../store/app'
import { Page } from '../Page'
import { Search } from '../Search'

export default function SearchRoute() {
  const hasQuery = useAppStore((store) => store.query.length > 0)
  const blocks = useAppStore((store) => store.blocks)
  const scripts = useAppStore((store) => store.scripts)

  return (
    <Page>
      <Search />
      {!hasQuery && (
        <>
          <ol>
            {scripts.map(([slug, label]) => (
              <li key={slug}>
                <NavLink to={`/script/${slug}`}>Script: {label}</NavLink>
              </li>
            ))}
          </ol>
          <ol>
            {blocks.map(([slug, label]) => (
              <li key={slug}>
                <NavLink to={`/block/${slug}`}>Block: {label}</NavLink>
              </li>
            ))}
          </ol>
        </>
      )}
    </Page>
  )
}
