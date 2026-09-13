import { describe, expect, it } from 'vitest'
import { COMMANDS, SECTION_IDS, resolveCommand } from './commands'

describe('resolveCommand', () => {
  it('resolves by name', () => {
    expect(resolveCommand('projects')?.name).toBe('projects')
  })

  it('resolves aliases, case and prompt insensitive', () => {
    expect(resolveCommand('  $ LS ~/projects ')?.name).toBe('projects')
    expect(resolveCommand('./contact.sh')?.name).toBe('contact')
    expect(resolveCommand('clear')?.name).toBe('whoami')
  })

  it('returns undefined for unknown or empty input', () => {
    expect(resolveCommand('rm -rf /')).toBeUndefined()
    expect(resolveCommand('   ')).toBeUndefined()
  })

  it('every scroll target is a real section and names are unique', () => {
    const names = COMMANDS.flatMap((c) => [c.name, ...c.aliases])
    expect(new Set(names).size).toBe(names.length)
    for (const c of COMMANDS) {
      if (c.action.kind === 'scroll') expect(SECTION_IDS).toContain(c.action.target)
    }
  })
})
