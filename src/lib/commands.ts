import { links } from '@/data/profile'

export const SECTION_IDS = ['top', 'experience', 'projects', 'certs', 'education', 'leadership', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export type CommandAction =
  | { kind: 'scroll'; target: SectionId }
  | { kind: 'open'; href: string }
  | { kind: 'help' }

export type TerminalCommand = { name: string; aliases: string[]; description: string; action: CommandAction }

export const COMMANDS: TerminalCommand[] = [
  { name: 'whoami', aliases: ['clear', 'home'], description: 'back to the top', action: { kind: 'scroll', target: 'top' } },
  { name: 'experience', aliases: ['cat experience.log'], description: 'work history', action: { kind: 'scroll', target: 'experience' } },
  { name: 'projects', aliases: ['ls', 'ls ~/projects'], description: 'list projects', action: { kind: 'scroll', target: 'projects' } },
  { name: 'certs', aliases: ['cat certs.txt', 'skills'], description: 'certifications and skills', action: { kind: 'scroll', target: 'certs' } },
  { name: 'education', aliases: ['cat education.txt'], description: 'degrees', action: { kind: 'scroll', target: 'education' } },
  { name: 'leadership', aliases: ['history'], description: 'leadership and CTF', action: { kind: 'scroll', target: 'leadership' } },
  { name: 'contact', aliases: ['./contact.sh', 'email'], description: 'get in touch', action: { kind: 'scroll', target: 'contact' } },
  { name: 'resume', aliases: ['resume.pdf', 'cv'], description: 'open resume.pdf', action: { kind: 'open', href: links.resume } },
  { name: 'github', aliases: [], description: 'open GitHub', action: { kind: 'open', href: links.github } },
  { name: 'linkedin', aliases: [], description: 'open LinkedIn', action: { kind: 'open', href: links.linkedin } },
  { name: 'help', aliases: ['?', 'man'], description: 'list commands', action: { kind: 'help' } },
]
