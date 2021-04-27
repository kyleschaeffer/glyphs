import React, { useCallback, useState } from 'react'

import { setQuery } from '../../store/actions'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { useDispatch } from '../hooks/useDispatch'
import { useSelector } from '../hooks/useSelector'

const QUERY_DEBOUNCE_MS = 300

export const SearchForm: React.FC = () => {
  const dispatch = useDispatch()
  const query = useSelector((state) => state.query)

  const [value, setValue] = useState(query)
  const queryResult = useDebouncedCallback((newValue: string) => dispatch(setQuery(newValue)), QUERY_DEBOUNCE_MS, [])
  const onInput = useCallback(({ target: { value: newValue } }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(newValue)
    queryResult(newValue)
  }, [])

  return <input type="search" value={value} onChange={onInput} autoComplete="none" autoFocus />
}
