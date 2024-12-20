import { describe, expect, test } from 'bun:test'
import { clamp, degreesToRadians, invlerp, lerp, radiansToDegrees, roundToNearest, toPrecision } from './math'

describe('Math', () => {
  test('Clamps values', () => {
    expect(clamp(0, 0, 0)).toBe(0)
    expect(clamp(1, 1, 1)).toBe(1)
    expect(clamp(1, 0.5, 0.75)).toBe(0.75)
    expect(clamp(0.25, 0.5, 0.75)).toBe(0.5)
    expect(clamp(-20, -10, 10)).toBe(-10)
  })

  test('Linearly interpolates values', () => {
    expect(lerp(0, 1, 0)).toBe(0)
    expect(lerp(0, 1, 0.5)).toBe(0.5)
    expect(lerp(0, 1, 1)).toBe(1)
    expect(lerp(0, 100, 1.5)).toBe(150)
    expect(lerp(-20, 5, 0.75)).toBe(-1.25)
    expect(lerp(6, 12, -0.25)).toBe(4.5)
  })

  test('Inversely interpolates values', () => {
    expect(invlerp(0, 1, 0)).toBe(0)
    expect(invlerp(0, 1, 0.5)).toBe(0.5)
    expect(invlerp(0, 1, 1)).toBe(1)
    expect(invlerp(0, 100, 150)).toBe(1.5)
    expect(invlerp(-20, 5, -1.25)).toBe(0.75)
    expect(invlerp(6, 12, 4.5)).toBe(-0.25)
  })

  test('Converts degrees to radians', () => {
    expect(degreesToRadians(0)).toBe(0)
    expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4)
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2)
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    expect(degreesToRadians(360)).toBeCloseTo(Math.PI * 2)
    expect(degreesToRadians(450)).toBeCloseTo(Math.PI * 2.5)
    expect(degreesToRadians(-45)).toBeCloseTo(Math.PI / -4)
  })

  test('Converts radians to degrees', () => {
    expect(radiansToDegrees(0)).toBe(0)
    expect(radiansToDegrees(0.785398)).toBeCloseTo(45)
    expect(radiansToDegrees(Math.PI)).toBe(180)
    expect(radiansToDegrees(Math.PI * 4)).toBe(720)
    expect(radiansToDegrees(-0.785398)).toBeCloseTo(-45)
  })

  test('Rounds values to precision', () => {
    const n = 1.111111111
    expect(toPrecision(n, 0)).toBe(1)
    expect(toPrecision(n, 1)).toBe(1.1)
    expect(toPrecision(n, 2)).toBe(1.11)
    expect(toPrecision(n, 3)).toBe(1.111)
    expect(toPrecision(n, 4)).toBe(1.1111)
    expect(toPrecision(n, 5)).toBe(1.11111)
    expect(toPrecision(n, 6)).toBe(1.111111)
    expect(toPrecision(n, 7)).toBe(1.1111111)
    expect(toPrecision(n, 8)).toBe(1.11111111)
    expect(toPrecision(n, 9)).toBe(1.111111111)
  })

  test('Rounds values to nearest increment', () => {
    expect(roundToNearest(1, 12.8)).toBe(13)
    expect(roundToNearest(10, 3)).toBe(0)
    expect(roundToNearest(10, 7)).toBe(10)
    expect(roundToNearest(10, 58)).toBe(60)
    expect(roundToNearest(0.1, 0.74)).toBeCloseTo(0.7, 6)
  })
})
