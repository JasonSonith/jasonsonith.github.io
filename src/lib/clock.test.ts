import { expect, it } from 'vitest'
import { formatClock } from './clock'

it('formats a local timestamp like a tmux status clock', () => {
  expect(formatClock(new Date(2026, 8, 3, 7, 5, 9))).toBe('2026-09-03 07:05:09')
})
