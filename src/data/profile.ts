export const links = {
  email: 'mailto:JasonSonith1@gmail.com',
  emailText: 'JasonSonith1@gmail.com',
  github: 'https://github.com/JasonSonith',
  linkedin: 'https://www.linkedin.com/in/jason-sonith',
  site: 'https://jasonsonith.github.io',
  resume: '/resume.pdf',
  resumeAbsolute: 'https://jasonsonith.github.io/resume.pdf',
} as const

export const identity = {
  name: 'Jason Sonith',
  handle: 'jason@sonith',
  roles: ['Penetration Tester / Product Security', 'M.S. Information Security @ Georgia Tech'],
  certsShort: ['SEC+', 'CySA+', 'AWS CP'],
}

export type Experience = {
  periodShort: string
  period: string
  org: string
  orgShort: string
  role: string
  points: string[]
}

export const experience: Experience[] = [
  {
    periodShort: '2026.05-26.08',
    period: 'May-Aug 2026',
    org: 'Honeywell',
    orgShort: 'Honeywell',
    role: 'Product Security Assurance Intern',
    points: [
      'Tested firmware, web applications, and software for security vulnerabilities; assessed risk across product lines.',
      'Used Nmap, Burp Suite, OWASP ZAP, and Gobuster to enumerate services and test web applications.',
      'Documented findings and remediation recommendations for developers; validated fixes with product teams.',
    ],
  },
  {
    periodShort: '2025.02-26.05',
    period: 'Feb 2025-May 2026',
    org: 'Mobile Health Infirmary',
    orgShort: 'Mobile Health Infirmary',
    role: 'Cybersecurity Intern',
    points: [
      'Monitored network activity for vulnerabilities, supported system hardening, and resolved staff access issues.',
      'Developed and implemented a NIST-aligned incident response playbook defining severity levels, response roles, evidence handling, and recovery validation to support HIPAA/HITECH requirements.',
      'Supported migration of on-premises systems to AWS.',
    ],
  },
  {
    periodShort: '2025.07-26.05',
    period: 'Jul 2025-May 2026',
    org: 'University of South Alabama',
    orgShort: 'Univ. of South Alabama',
    role: 'Research Assistant',
    points: [
      'Built Python preprocessing scripts with ObsPy and pandas to extract metadata and normalize seismic recordings.',
      'Tuned a nonlinear phase space classifier across 16 graph features and 600,000 labeled waveforms.',
    ],
  },
]

export type Service = { port: string; service: string }

// Tools shown on the default ports they listen on.
export const services: Service[] = [
  { port: '8080/tcp', service: 'burp-suite' },
  { port: '4444/tcp', service: 'metasploit' },
  { port: '8834/tcp', service: 'nessus' },
  { port: '8000/tcp', service: 'splunk' },
  { port: '51820/udp', service: 'wireguard' },
]

export type Project = {
  slug: string
  name: string
  role?: string
  period?: string
  summary: string
  points: string[]
  stack: string[]
  repo?: string
}

export const projects: Project[] = [
  {
    slug: 'skills-assessment-platform',
    name: 'Engineering Skills Assessment Platform',
    role: 'Co-founder & Developer',
    period: '2026.07-now',
    summary: 'Browser-based CAD platform for practical engineering assessments.',
    points: [
      'Implemented token-authenticated session APIs and autosave recovery.',
      'Addressed path traversal, stale-write conflicts, and submission failure handling.',
    ],
    stack: ['TypeScript', 'WebAssembly', 'Python', 'FastAPI'],
  },
  {
    slug: 'oscp-labs',
    name: 'OSCP Penetration Testing Labs',
    role: 'HTB / CPTS',
    period: '2026.07-now',
    summary: 'Hands-on offensive practice while preparing for the OSCP.',
    points: [
      'Service enumeration, web exploitation, packet analysis, and Linux privilege escalation.',
      'Documented attack paths and findings for each target.',
    ],
    stack: ['Linux', 'Nmap', 'Burp Suite', 'Metasploit'],
    repo: 'https://github.com/JasonSonith/OSCP',
  },
  {
    slug: 'nextcloud-lab',
    name: 'Nextcloud Security Assessment Lab',
    period: '2025.08',
    summary: 'Docker lab with nginx, TLS, and MariaDB, attacked to assess a self-hosted Nextcloud.',
    points: [
      'Tested authentication, sessions, brute-force protection, and CSRF defenses.',
      'Documented findings and remediation for each issue.',
    ],
    stack: ['Docker', 'nginx', 'MariaDB', 'Burp Suite', 'OWASP ZAP', 'Nmap'],
    repo: 'https://github.com/JasonSonith/Team-7-nextcloud-security-lab',
  },
  {
    slug: 'medical-device-validation',
    name: 'Multi-Agent AI Medical Device Validation Platform',
    summary: 'Python pipeline that scrapes manufacturer sites and validates device data against the FDA GUDID database.',
    points: [
      'Secured with bcrypt hashing, role-based access control, and breached-password screening at signup.',
      'Cleared an OWASP ZAP scan: 58 checks, zero failures.',
    ],
    stack: ['Python', 'bcrypt', 'RBAC', 'OWASP ZAP'],
  },
  {
    slug: 'earthquake-prediction',
    name: 'Earthquake Prediction Research',
    period: '2025.07-2026.05',
    summary: 'Nonlinear phase space classification of seismic waveforms.',
    points: ['Preprocessing with ObsPy and pandas; classifier tuned across 16 graph features and 600,000 labeled waveforms.'],
    stack: ['Python', 'ObsPy', 'pandas'],
    repo: 'https://github.com/JasonSonith/Earthquake-prediction',
  },
  {
    slug: 'pfsense-lab',
    name: 'pfSense IDS/IPS Lab',
    summary: 'Small enterprise network simulation with Kali Linux as the attacker and pfSense providing IDS/IPS.',
    points: [],
    stack: ['pfSense', 'Kali Linux', 'Ubuntu'],
    repo: 'https://github.com/JasonSonith/pfsense-ids-ips-lab',
  },
  {
    slug: 'python-log-analyzer',
    name: 'python-log-analyzer',
    summary: 'Script that analyzes JSON logs and flags suspicious events.',
    points: [],
    stack: ['Python'],
    repo: 'https://github.com/JasonSonith/python-log-analyzer',
  },
]

export const certs = ['CompTIA Security+', 'CompTIA CySA+', 'AWS Cloud Practitioner']
export const awards = ['School of Computing Student of the Year, University of South Alabama (2025-2026)']

export type Education = { school: string; degree: string; period: string; detail?: string }
export const education: Education[] = [
  { school: 'Georgia Institute of Technology', degree: 'M.S. Information Security', period: 'Expected May 2028' },
  {
    school: 'University of South Alabama',
    degree: 'B.S. Computer Science, Cybersecurity Concentration',
    period: '2022-2026',
    detail: 'GPA 3.9, summa cum laude',
  },
]

export type Leadership = { title: string; org: string; period: string; point: string }
export const leadership: Leadership[] = [
  {
    title: 'Member',
    org: 'GreyHat',
    period: 'Aug 2026-now',
    point: 'Competed in TNC26 CTF, solving web vulnerability challenges by crafting payloads to escalate privileges and capture flags.',
  },
  {
    title: 'Student Government Senator',
    org: 'University of South Alabama',
    period: 'Mar 2025-May 2026',
    point: 'Started a School of Computing hackathon and passed legislation securing $6,000 for computing events.',
  },
  {
    title: 'President, Video Game Development Club',
    org: 'University of South Alabama',
    period: 'Fall 2024-May 2026',
    point: 'Revived an inactive club and rebuilt member engagement.',
  },
]

export type SkillGroup = { label: string; items: string[] }
export const skills: SkillGroup[] = [
  { label: 'security', items: ['Burp Suite', 'Nmap', 'OWASP ZAP', 'Metasploit', 'Gobuster', 'Splunk', 'Nessus', 'pfSense', 'WireGuard', 'Kali Linux'] },
  { label: 'cloud', items: ['AWS IAM', 'EC2', 'S3', 'GuardDuty', 'CloudTrail', 'Config', 'Linux', 'Docker'] },
  { label: 'languages', items: ['Python', 'PowerShell', 'Bash', 'Java', 'JavaScript', 'C'] },
]
