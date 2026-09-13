import { useEffect, useRef } from 'react'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789abcdef#$%&*+=<>'
const COL_W = 34
const ROW_H = 19

const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

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
    let visible = true
    let raf = 0
    let last = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const offset = (w - grid.length * COL_W) / 2
      grid.forEach((column, c) => {
        column.forEach((ch, r) => {
          const behind = (heads[c] - r + rows) % rows
          ctx.fillStyle = behind === 0 ? '#b6ffd3' : `rgb(8 246 121 / ${Math.max(0.55, 1 - behind / rows).toFixed(2)})`
          ctx.fillText(ch, offset + c * COL_W + COL_W / 2, (r + 1) * ROW_H - 5)
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
      grid = Array.from({ length: Math.max(1, Math.floor(w / COL_W)) }, () => Array.from({ length: rows }, glyph))
      heads = grid.map(() => Math.floor(Math.random() * rows))
      draw()
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden || t - last < 90) return
      last = t
      grid.forEach((column, c) => {
        heads[c] = (heads[c] + 1) % rows
        column[heads[c]] = glyph()
      })
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)
    if (!reduce) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
