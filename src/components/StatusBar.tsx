import { useEffect } from 'react'
import { links } from '@/data/profile'
import { isTypingTarget } from '@/lib/dom'

const ITEMS = [
  { key: '1', label: 'contact', short: 'mail', href: '#contact', external: false },
  { key: '2', label: 'resume.pdf', short: 'cv', href: links.resume, external: true },
  { key: '3', label: 'github', short: 'gh', href: links.github, external: true },
  { key: '4', label: 'linkedin', short: 'in', href: links.linkedin, external: true },
]

export function StatusBar() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return
      document.querySelector<HTMLAnchorElement>(`[data-hotkey="${e.key}"]`)?.click()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-[0.6vw] bottom-[2.2vh] z-40 grid h-[var(--statusbar-h)] grid-cols-[28.6%_27.4%_25.6%_1fr] items-center max-md:grid-cols-4 bg-term px-[1.1vw] text-term-bg"
    >
      {ITEMS.map((item) => (
        <a
          key={item.key}
          data-hotkey={item.key}
          aria-label={item.label}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
          className="justify-self-start no-underline hover:bg-term-bg hover:text-term"
        >
          [{item.key}]&nbsp;&nbsp;<span className="max-md:hidden">{item.label}</span>
          <span className="hidden max-md:inline">{item.short}</span>
        </a>
      ))}
    </nav>
  )
}
