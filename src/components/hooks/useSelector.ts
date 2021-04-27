import { useContext } from 'react'

import { GlyphsState } from '../../store/reducers'
import { GlyphsContext } from '../controllers/GlyphsController'

export const useSelector = <T>(selector: (state: GlyphsState) => T): T => {
  const [state] = useContext(GlyphsContext)
  return selector(state)
}
