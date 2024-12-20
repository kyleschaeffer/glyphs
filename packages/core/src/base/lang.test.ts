import { describe, expect, test } from 'bun:test'
import { isSlug, slugify } from './lang'

describe('Lang', () => {
  test('Slugifies strings', () => {
    expect(slugify('Hello, Glyphs.')).toBe('hello-glyphs')
    expect(slugify('  ---G#l*Y&@p$Hs()-==  ')).toBe('glyphs')
    expect(slugify('123.Glyphs')).toBe('glyphs')
    expect(slugify(' 123 Glyphs ')).toBe('glyphs')
    expect(slugify('Glyphs123')).toBe('glyphs123')
    expect(slugify('Glyphs  123-- ')).toBe('glyphs-123')
    expect(slugify('åñüîçé œ∑®†¥øπ“‘”’\'"«\\|`~!@#$%^&*()-=_+ß∂ƒ©∆˚¬…æ≈√∫µ≤≥,./÷')).toBe('anuice')
  })

  test('Validates slug strings', () => {
    expect(isSlug('glyphs')).toBe(true)
    expect(isSlug('way-map')).toBe(true)
    expect(isSlug('glyphs1')).toBe(true)
    expect(isSlug('way-map1')).toBe(true)
    expect(isSlug('1glyphs')).toBe(false)
    expect(isSlug('way--map')).toBe(false)
    expect(isSlug('WaYmAp')).toBe(false)
    expect(isSlug('way$map')).toBe(false)
  })
})
