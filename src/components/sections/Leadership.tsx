import { leadership } from '@/data/profile'
import { Section } from '../Section'

export function Leadership() {
  return (
    <Section id="leadership" command="history | grep leadership" title="Leadership and CTF">
      <ol className="grid gap-[1lh]">
        {leadership.map((l, i) => (
          <li key={l.title} className="grid grid-cols-[5ch_1fr]">
            <span className="text-term-dim tabular-nums">{String(i + 1).padStart(3, ' ')}</span>
            <span>
              {l.title}, {l.org} <span className="text-term-dim">[{l.period}]</span>
              <span className="block text-term-dim">{l.point}</span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
