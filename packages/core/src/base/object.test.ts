import { beforeEach, describe, expect, test } from 'bun:test'
import { patch } from './object'

describe('Object utils', () => {
  let user = {
    handle: 'hello',
    prefs: {
      a: { id: 'a', name: 'A' },
      b: { id: 'b', name: 'B' },
    },
    updatedAt: 0,
  }

  beforeEach(() => {
    user = {
      handle: 'hello',
      prefs: {
        a: { id: 'a', name: 'A' },
        b: { id: 'b', name: 'B' },
      },
      updatedAt: 0,
    }
  })

  test('Patches objects', () => {
    const next = patch(user, { handle: 'next', updatedAt: 1 })
    expect(next.handle).toBe('next')
    expect(next.updatedAt).toBe(1)
    expect(next === user).toBe(false)
    expect(next.prefs === user.prefs).toBe(true)
  })

  test('Patches nested objects', () => {
    const next = user
    const nextPrefs = patch(next.prefs, { a: { id: 'a', name: 'C' } })
    expect(nextPrefs.a.id).toBe('a')
    expect(nextPrefs.a.name).toBe('C')
    expect(nextPrefs.b.name).toBe('B')
    expect(nextPrefs === user.prefs).toBe(false)
    expect(next === user).toBe(true)
  })

  test('Ignores undefined values', () => {
    const next = patch(user, { handle: 'next', prefs: undefined, updatedAt: undefined })
    expect(next.handle).toBe('next')
    expect(next.updatedAt).toBe(0)
    expect(typeof next.prefs).toBe('object')
  })
})
