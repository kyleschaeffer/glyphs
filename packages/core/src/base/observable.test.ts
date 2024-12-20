import { describe, expect, test } from 'bun:test'
import { makeObservable } from './observable'

describe('Observable', () => {
  test('Observes values', () => {
    const o = makeObservable(1, { throttleTimeMs: 0 })

    const notifications: number[] = []
    const listener = (next: number) => notifications.push(next)
    o.subscribe(listener)

    for (let i = 2; i <= 5; i++) {
      o.next(i)
    }

    expect(notifications).toEqual([1, 2, 3, 4, 5])
  })

  test('Observes throttled values', async () => {
    const o = makeObservable(1, { throttleTimeMs: 20 })

    const notifications: number[] = []
    const listener = (next: number) => notifications.push(next)
    o.subscribe(listener)

    for (let i = 2; i <= 7; i++) {
      o.next(i)
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 10)
      })
    }

    expect(notifications).toEqual([1, 3, 5, 7])
  })
})
