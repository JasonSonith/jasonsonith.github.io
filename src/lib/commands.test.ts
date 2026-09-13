import { expect, it } from 'vitest'
import { COMMANDS } from './commands'

it('command names and aliases are unique, so cmdk filtering never shows duplicates', () => {
  const names = COMMANDS.flatMap((c) => [c.name, ...c.aliases])
  expect(new Set(names).size).toBe(names.length)
})
