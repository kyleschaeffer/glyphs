import React, { useReducer } from 'react'

import { GlyphsAction } from '../../store/actions'
import { GlyphsState, reducer } from '../../store/reducers'
import { useGlyphsData } from '../hooks/useGlyphsData'

const initialState: GlyphsState = {
  error: null,
  glyph: null,
  glyphs: new Map(),
  loading: true,
  query: '',
}

export const GlyphsContext = React.createContext<[GlyphsState, React.Dispatch<GlyphsAction>]>([initialState, () => {}])

export const GlyphsController: React.FC = ({ children }) => {
  const store = useReducer(reducer, initialState)

  return (
    <GlyphsContext.Provider value={store}>
      <GlyphsLoader>{children}</GlyphsLoader>
    </GlyphsContext.Provider>
  )
}

const GlyphsLoader: React.FC = ({ children }) => {
  useGlyphsData()

  return <>{children}</>
}
