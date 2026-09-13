import { useEffect } from 'react'
import { links } from '@/data/profile'
import { isTypingTarget } from '@/lib/dom'

const ITEMS = [
  { key: '1', label: 'contact', href: '#contact', external: false },
  { key: '2', label: 'resume', href: links.resume, external: true },
  { key: '3', label: 'github', href: links.github, external: true },
  { key: '4', label: 'linkedin', href: links.linkedin, external: true },
]

export function StatusBar() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return
      if (e.target instanceof Element && e.target.closest('[role="dialog"]')) return
      if (!/^[1-4]$/.test(e.key)) return
      document.querySelector<HTMLAnchorElement>(`[data-hotkey="${e.key}"]`)?.click()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-[0.6vw] bottom-[2.2vh] z-40 grid h-[var(--statusbar-h)] grid-cols-[28.6%_27.4%_25.6%_1fr] items-center bg-term px-[1.1vw] text-term-bg max-md:inset-x-0 max-md:bottom-0 max-md:grid-cols-4 max-md:px-4"
    >
      {ITEMS.map((item) => (
        <a
          key={item.key}
          data-hotkey={item.key}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
          className="justify-self-start no-underline hover:bg-term-bg hover:text-term focus-visible:bg-term-bg focus-visible:text-term focus-visible:outline-term-bg"
        >
          <span aria-hidden="true" className="max-md:hidden">
            [{item.key}]&nbsp;&nbsp;
          </span>
          {item.label === 'resume' ? <span>resume<span className="max-md:hidden">.pdf</span></span> : item.label}
        </a>
      ))}
    </nav>
  )
}
