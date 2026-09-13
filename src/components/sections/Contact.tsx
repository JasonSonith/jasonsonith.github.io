import { Button } from '@/components/ui/button'
import { links } from '@/data/profile'
import { Section } from '../Section'

const ROWS = [
  { label: 'email', href: links.email, text: links.emailText, external: false },
  { label: 'linkedin', href: links.linkedin, text: links.linkedin.replace('https://www.', ''), external: true },
  { label: 'github', href: links.github, text: links.github.replace('https://', ''), external: true },
]

export function Contact() {
  return (
    <Section id="contact" command="./contact.sh" title="Contact">
      <p className="text-term-dim">[*] opening channel to jason@sonith ...</p>
      <dl className="mt-[1lh] grid grid-cols-[10ch_1fr] gap-y-[0.25lh]">
        {ROWS.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-term-dim">{r.label}</dt>
            <dd>
              <a href={r.href} target={r.external ? '_blank' : undefined} rel={r.external ? 'noreferrer' : undefined}>
                {r.text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-[1.5lh] flex flex-wrap gap-[2ch]">
        <Button asChild>
          <a href={links.email} className="no-underline">
            [ send email ]
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={links.resume} target="_blank" rel="noreferrer" className="no-underline">
            [ resume.pdf ]
          </a>
        </Button>
      </div>
    </Section>
  )
}
