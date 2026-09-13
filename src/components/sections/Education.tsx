import { education } from '@/data/profile'
import { Section } from '../Section'

export function Education() {
  return (
    <Section id="education" command="cat education.txt" title="Education">
      <ul className="grid gap-[1lh]">
        {education.map((e) => (
          <li key={e.school}>
            <p>
              {e.school} <span className="text-term-dim">[{e.period}]</span>
            </p>
            <p className="pl-[2ch]">{e.degree}</p>
            {e.detail && <p className="pl-[2ch] text-term-dim">{e.detail}</p>}
          </li>
        ))}
      </ul>
    </Section>
  )
}
