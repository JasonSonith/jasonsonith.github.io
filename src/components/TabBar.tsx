import { identity } from '@/data/profile'
import { formatClock, useClock } from '@/lib/clock'

export function TabBar() {
  const now = useClock()
  return (
    <div className="mx-[0.6vw] mt-[1.1vh] grid h-[max(32px,4.6vh)] grid-cols-3 items-center border border-term px-[1.1vw]">
      <span>
        [0]&nbsp;&nbsp;{identity.handle}: ~ <kbd className="text-term-dim max-lg:hidden">ctrl+k</kbd>
      </span>
      <span className="justify-self-center">{identity.certsShort.join(' | ')}</span>
      <time className="justify-self-end tabular-nums" dateTime={now.toISOString()}>
        {formatClock(now)}
      </time>
    </div>
  )
}
