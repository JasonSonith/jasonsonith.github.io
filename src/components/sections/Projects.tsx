import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { projects } from '@/data/profile'
import { Section } from '../Section'

export function Projects() {
  return (
    <Section id="projects" command="ls -la ~/projects" title="Projects">
      <p className="text-term-dim">total {projects.length}</p>
      <Accordion type="multiple" className="border-t border-term-faint">
        {projects.map((p) => (
          <AccordionItem key={p.slug} value={p.slug} className="border-term-faint">
            <AccordionTrigger className="px-[1ch] py-[0.4lh] text-base hover:bg-term-faint aria-expanded:bg-term aria-expanded:text-term-bg aria-expanded:**:text-term-bg aria-expanded:**:data-[slot=accordion-trigger-icon]:text-term-bg">
              <span className="grid w-full grid-cols-[11ch_16ch_1fr] gap-x-[2ch] text-left max-md:grid-cols-1">
                <span aria-hidden="true" className="text-term-dim max-md:hidden">drwxr-xr-x</span>
                <span className="text-term-dim tabular-nums">{p.period ?? '-'}</span>
                <span>
                  {p.name}/{p.role && <span className="text-term-dim"> ({p.role})</span>}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-[30ch] pt-[0.5lh] text-base max-md:pl-[1ch]">
              <p>{p.summary}</p>
              {p.points.length > 0 && (
                <ul className="mt-[0.5lh] grid gap-[0.25lh]">
                  {p.points.map((pt) => (
                    <li key={pt} className="relative pl-[2ch] before:absolute before:left-0 before:text-term-dim before:content-['>']">
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-[0.5lh] text-term-dim">stack: {p.stack.join(', ')}</p>
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="mt-[0.5lh] inline-block">
                  git clone {p.repo.replace('https://', '')}
                </a>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
