import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'

import { Glyph } from '../../types/glyphs'

const UNICODE_DATA_LENGTH = 2749550

export type GlyphsState = {
  glyphs: Map<string, Glyph>
  loading: boolean
  progress: number
  error: string | null
}

export const GlyphsContext = React.createContext<GlyphsState>({
  glyphs: new Map(),
  loading: true,
  progress: 0,
  error: null,
})

export const GlyphsController: React.FC = ({ children }) => {
  const [glyphs, setGlyphs] = useState<Map<string, Glyph>>(new Map())
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGlyphs = async () => {
      try {
        const response = await axios.get<[string, Glyph][]>('/unicode/13.0.0.json', {
          onDownloadProgress: (e: ProgressEvent) => {
            setProgress(e.loaded / UNICODE_DATA_LENGTH)
          },
        })

        setGlyphs(new Map(response.data))
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
        setProgress(1)
      }
    }

    fetchGlyphs()
  }, [])

  const state = useMemo<GlyphsState>(
    () => ({
      glyphs,
      loading,
      progress,
      error,
    }),
    [glyphs, loading, progress, error]
  )

  return <GlyphsContext.Provider value={state}>{children}</GlyphsContext.Provider>
}
