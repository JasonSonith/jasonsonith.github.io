import { experience } from '@/data/profile'
import { Section } from '../Section'

export function Experience() {
  return (
    <Section id="experience" command="cat experience.log --verbose" title="Experience">
      <ol className="grid gap-[1.5lh]">
        {experience.map((e) => (
          <li key={e.org}>
            <p>
              <span className="text-term-dim tabular-nums">[{e.period}]</span> {e.org} :: {e.role}
            </p>
            <ul className="mt-[0.5lh] grid gap-[0.25lh] pl-[2ch]">
              {e.points.map((pt) => (
                <li key={pt} className="relative pl-[2ch] before:absolute before:left-0 before:text-term-dim before:content-['>']">
                  {pt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
