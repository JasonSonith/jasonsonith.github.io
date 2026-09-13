import { useEffect } from 'react'

export function useBootSkip() {
  useEffect(() => {
    const done = () => {
      document.documentElement.dataset.boot = 'done'
      window.removeEventListener('keydown', done)
      window.removeEventListener('pointerdown', done)
    }
    window.addEventListener('keydown', done)
    window.addEventListener('pointerdown', done)
    return () => {
      window.removeEventListener('keydown', done)
      window.removeEventListener('pointerdown', done)
    }
  }, [])
}
