import { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { COMMANDS, resolveCommand, type TerminalCommand } from '@/lib/commands'
import { isTypingTarget } from '@/lib/dom'
import { perform } from '@/lib/perform'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)
      const slash = e.key === '/' && !isTypingTarget(e.target)
      if (!combo && !slash) return
      e.preventDefault()
      setOpen((o) => !o)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const run = (cmd: TerminalCommand) => {
    setQuery('')
    if (cmd.action.kind === 'help') return
    setOpen(false)
    perform(cmd.action)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Terminal" description="Type a command, or help">
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="type a command, or help"
        onKeyDown={(e) => {
          const exact = resolveCommand(query)
          if (e.key === 'Enter' && exact) {
            e.preventDefault()
            run(exact)
          }
        }}
      />
      <CommandList>
        <CommandEmpty>command not found: {query.trim()} (try help)</CommandEmpty>
        <CommandGroup heading="commands">
          {COMMANDS.map((c) => (
            <CommandItem key={c.name} value={[c.name, ...c.aliases].join(' ')} onSelect={() => run(c)}>
              <span>{c.name}</span>
              <span className="ml-auto text-term-dim">{c.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
