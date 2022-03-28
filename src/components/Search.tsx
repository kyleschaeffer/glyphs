import { Component } from 'solid-js'
import { charToDecimal } from '../core/convert'

export const Search: Component = () => {
  return (
    <div>
      <input type="search" />
      🍕 = {charToDecimal('🍕')}
    </div>
  )
}
