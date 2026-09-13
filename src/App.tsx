import { Hero } from '@/components/Hero'
import { StatusBar } from '@/components/StatusBar'
import { Certs } from '@/components/sections/Certs'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Leadership } from '@/components/sections/Leadership'
import { Projects } from '@/components/sections/Projects'

export default function App() {
  return (
    <>
      <Hero />
      <main className="mx-auto max-w-[110ch] px-[1.75vw] pb-[calc(var(--statusbar-h)+6lh)] max-md:px-4">
        <Experience />
        <Projects />
        <Certs />
        <Education />
        <Leadership />
        <Contact />
      </main>
      <StatusBar />
    </>
  )
}
