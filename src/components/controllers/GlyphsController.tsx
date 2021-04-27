import React, { useReducer } from 'react'

import { GlyphsAction } from '../../store/actions'
import { GlyphsState, initialState, reducer } from '../../store/reducers'
import { useGlyphsData } from '../hooks/useGlyphsData'

export const GlyphsContext = React.createContext<[GlyphsState, React.Dispatch<GlyphsAction>]>([initialState, () => {}])

export const GlyphsController: React.FC = ({ children }) => {
  const store = useReducer(reducer, initialState)

  return (
    <GlyphsContext.Provider value={store}>
      <GlyphsLoader />
      {children}
    </GlyphsContext.Provider>
  )
}

const GlyphsLoader: React.FC = () => {
  useGlyphsData()
  return null
}
