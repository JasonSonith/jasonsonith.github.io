import type { ReactNode } from 'react'
import type { SectionId } from '@/lib/commands'

export function Section({ id, command, title, children }: { id: SectionId; command: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 pt-[3lh]">
      <h2 id={`${id}-title`} className="font-normal">
        <span aria-hidden="true">
          <span className="text-term-dim">jason@sonith:~$ </span>
          {command}
        </span>
        <span className="sr-only">{title}</span>
      </h2>
      <div className="mt-[1lh]">{children}</div>
    </section>
  )
}
