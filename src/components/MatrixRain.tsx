import { useEffect, useRef } from 'react'

const LATIN = '0123456789abcdefghijklmnopqrstuvwxyz#$%&*+=<>'
const KANA = 'アイウエオカキクケコサシスセソタチツテト'
const COLUMNS = 2
const ROW_H = 19
const TRAIL = 4

const glyph = () => {
  const r = Math.random()
  if (r < 0.1) return '·'
  if (r < 0.22) return KANA[Math.floor(Math.random() * KANA.length)]
  return LATIN[Math.floor(Math.random() * LATIN.length)]
}

export function MatrixRain({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let rows = 0
    let grid: string[][] = []
    let heads: number[] = []
    let onScreen = true
    let raf = 0
    let last = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const colW = w / COLUMNS
      grid.forEach((column, c) => {
        column.forEach((ch, r) => {
          const behind = (heads[c] - r + rows) % rows
          const alpha = behind < TRAIL ? 1 : 0.82
          ctx.fillStyle = behind === 0 ? '#c8ffe0' : `rgb(8 246 121 / ${alpha.toFixed(2)})`
          ctx.fillText(ch, c * colW + colW / 2, (r + 1) * ROW_H - 5)
        })
      })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      ;({ width: w, height: h } = canvas.getBoundingClientRect())
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = '13px "Google Sans Code", monospace'
      ctx.textAlign = 'center'
      rows = Math.max(1, Math.floor(h / ROW_H))
      grid = Array.from({ length: COLUMNS }, () => Array.from({ length: rows }, glyph))
      heads = grid.map((_, c) => Math.floor((rows / COLUMNS) * c + Math.random() * 4))
      draw()
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t - last < 90) return
      last = t
      grid.forEach((column, c) => {
        heads[c] = (heads[c] + 1) % rows
        column[heads[c]] = glyph()
      })
      draw()
    }

    const sync = () => {
      cancelAnimationFrame(raf)
      if (!reduce && onScreen && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
