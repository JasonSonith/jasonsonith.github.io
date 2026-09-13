import type { ReactNode } from 'react'
import type { SectionId } from '@/lib/commands'

export function Section({ id, command, title, children }: { id: SectionId; command: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 pt-[1.5lh]">
      <div className="border border-term-dim">
        <h2 id={`${id}-title`} className="flex justify-between gap-[2ch] border-b border-term-dim bg-term-faint px-[1ch] font-normal">
          <span aria-hidden="true">
            <span className="text-term-dim">jason@sonith:~$ </span>
            {command}
          </span>
          <span aria-hidden="true" className="shrink-0 text-term-dim max-md:hidden">
            [{id}]
          </span>
          <span className="sr-only">{title}</span>
        </h2>
        <div className="px-[2ch] py-[1lh] max-md:px-[1ch]">{children}</div>
      </div>
    </section>
  )
}
