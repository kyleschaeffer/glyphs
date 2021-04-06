import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { GlyphsController } from './controllers/GlyphsController'
import { SearchController } from './controllers/SearchController'
import { GlyphView } from './views/GlyphView'
import { ResultsView } from './views/ResultsView'
import { SearchView } from './views/SearchView'

export const App: React.FC = () => (
  <GlyphsController>
    <SearchController>
      <BrowserRouter>
        <Switch>
          <Route path="/:query/:glyph" component={GlyphView} />
          <Route path="/:query" component={ResultsView} />
          <Route path="/" component={SearchView} />
        </Switch>
      </BrowserRouter>
    </SearchController>
  </GlyphsController>
)
