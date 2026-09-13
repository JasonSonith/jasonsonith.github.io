import type { CSSProperties } from 'react'
import { ASCII_NAME, ASCII_NAME_STACKED } from '@/data/ascii-name'
import { experience, identity, services } from '@/data/profile'
import { MatrixRain } from './MatrixRain'
import { TabBar } from './TabBar'

const PROMPT = `${identity.handle}:~$`
const step = (i: number) => ({ '--i': i }) as CSSProperties

function Prompt({ cmd, i }: { cmd: string; i: number }) {
  return (
    <p className="boot" style={step(i)}>
      {PROMPT} {cmd}
    </p>
  )
}

function SessionPane() {
  return (
    <section aria-label="Session" className="pl-[1.72vw] pr-[2ch] pt-[2.1vh] max-md:px-4">
      <Prompt cmd="whoami" i={0} />
      <h1 className="sr-only">{identity.name}</h1>
      <pre aria-hidden="true" className="ascii boot mt-[3vh] max-md:hidden" style={step(1)}>
        {ASCII_NAME}
      </pre>
      <pre aria-hidden="true" className="boot mt-3 hidden text-[3vw] leading-[1.22] tracking-[-0.06em] max-md:block" style={step(1)}>
        {ASCII_NAME_STACKED}
      </pre>
      <div className="boot mt-[2.3vh]" style={step(2)}>
        {identity.roles.map((r) => (
          <p key={r}>{r}</p>
        ))}
        <p className="text-term-dim md:hidden">{identity.certsShort.join(' | ')}</p>
      </div>
      <div className="mt-[3.7vh]">
        <Prompt cmd="cat experience.log" i={3} />
      </div>
      <table className="boot mt-[2.6vh] w-full table-fixed border-collapse whitespace-nowrap max-md:block max-md:whitespace-normal" style={step(4)}>
        <caption className="sr-only">Experience</caption>
        <colgroup className="max-md:hidden">
          <col className="w-[14.4ch]" />
          <col className="w-[24ch]" />
          <col />
        </colgroup>
        <tbody className="max-md:grid max-md:gap-y-2">
          {experience.map((e) => (
            <tr key={e.org} className="max-md:grid max-md:grid-cols-[14ch_1fr] max-md:gap-x-2">
              <td className="p-0 tabular-nums">{e.periodShort}</td>
              <td className="p-0">{e.orgShort}</td>
              <td className="p-0 whitespace-normal max-md:col-start-2 max-md:text-term-dim">{e.roleShort ?? e.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="boot mt-[4.1vh]" style={step(5)}>
        {PROMPT} <span aria-hidden="true" className="cursor inline-block h-[1.1em] w-[0.6em] translate-y-[0.15em] bg-term" />
      </p>
    </section>
  )
}

function NmapPane() {
  return (
    <section
      aria-labelledby="nmap-title"
      className="border-l border-term pl-[1.64vw] pt-[1.9vh] max-md:mt-6 max-md:border-l-0 max-md:border-t max-md:px-4 max-md:pt-4"
    >
      <p id="nmap-title" className="boot" style={step(1)}>
        nmap -sV jason
      </p>
      <table className="boot mt-[2.26vh] border-collapse" style={step(2)}>
        <caption className="sr-only">Tools shown as open services</caption>
        <colgroup>
          <col className="w-[9.4vw] max-md:w-[10ch]" />
          <col className="w-[7.5vw] max-md:w-[7ch]" />
          <col />
        </colgroup>
        <thead>
          <tr className="text-left">
            <th className="p-0 font-normal">PORT</th>
            <th className="p-0 font-normal">STATE</th>
            <th className="p-0 font-normal">SERVICE</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.service}>
              <td className="p-0">{s.port}</td>
              <td className="p-0">open</td>
              <td className="p-0">{s.service}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function Hero() {
  return (
    <header id="top" className="relative flex min-h-[600px] flex-col pb-[calc(var(--statusbar-h)+3.4vh)] md:h-svh">
      <TabBar />
      <div className="grid flex-1 grid-cols-[63fr_37fr] max-md:grid-cols-1">
        <SessionPane />
        <NmapPane />
      </div>
      <MatrixRain className="pointer-events-none absolute right-0 top-[6.6%] h-[86.4%] w-[5.06%] max-md:hidden" />
    </header>
  )
}
