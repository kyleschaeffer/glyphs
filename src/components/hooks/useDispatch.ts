import { useContext } from 'react'

import { GlyphsContext } from '../controllers/GlyphsController'

export const useDispatch = () => {
  const [, dispatch] = useContext(GlyphsContext)
  return dispatch
}
