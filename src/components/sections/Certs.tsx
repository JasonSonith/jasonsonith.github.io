import { awards, certs, skills } from '@/data/profile'
import { Section } from '../Section'

export function Certs() {
  return (
    <Section id="certs" command="cat certs.txt skills.txt" title="Certifications and skills">
      <ul className="grid gap-[0.25lh]">
        {[...certs, ...awards].map((c) => (
          <li key={c}>
            <span className="text-term-dim">[verified]</span> {c}
          </li>
        ))}
      </ul>
      <dl className="mt-[1lh] grid grid-cols-[12ch_1fr] gap-y-[0.25lh] max-md:grid-cols-1">
        {skills.map((g) => (
          <div key={g.label} className="contents">
            <dt className="text-term-dim">{g.label}:</dt>
            <dd>{g.items.join('  ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
