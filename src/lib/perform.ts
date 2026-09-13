import type { CommandAction } from './commands'

export function perform(action: CommandAction) {
  if (action.kind === 'scroll') {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(action.target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  } else if (action.kind === 'open') {
    window.open(action.href, '_blank', 'noopener,noreferrer')
  }
}
