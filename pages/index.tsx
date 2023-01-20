import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { z } from 'zod'
import { Search } from '../components/Search'
import { useAppStore } from '../store/app'

export default function SearchRoute() {
  // const router = useRouter()
  // const query = router.isReady ? z.string().optional().parse(router.query.q) ?? '' : ''
  // const setQuery = useAppStore((store) => store.setQuery)

  // useEffect(() => {
  //   if (!router.isReady) return
  //   setQuery(query)
  // }, [query, router.isReady, setQuery])

  return <Search />
}
