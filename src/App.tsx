import { CommandPalette } from '@/components/CommandPalette'
import { Hero } from '@/components/Hero'
import { StatusBar } from '@/components/StatusBar'
import { Certs } from '@/components/sections/Certs'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Leadership } from '@/components/sections/Leadership'
import { Projects } from '@/components/sections/Projects'
import { useBootSkip } from '@/lib/boot'

export default function App() {
  useBootSkip()
  return (
    <>
      <Hero />
      <main className="px-[0.6vw] pb-[calc(var(--statusbar-h)+6lh)] max-md:px-2">
        <Experience />
        <Projects />
        <Certs />
        <Education />
        <Leadership />
        <Contact />
      </main>
      <StatusBar />
      <CommandPalette />
    </>
  )
}
