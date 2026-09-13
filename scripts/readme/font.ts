import { readFileSync } from 'node:fs'
import subsetFont from 'subset-font'

const DIR = 'node_modules/@fontsource/google-sans-code/files'
const FACES = [
  { file: 'google-sans-code-latin-400-normal.woff2', range: 'U+0000-00FF,U+2000-206F' },
  { file: 'google-sans-code-symbols2-400-normal.woff2', range: 'U+2500-259F' },
]

export async function embeddedFontCss(text: string) {
  const css = await Promise.all(
    FACES.map(async ({ file, range }) => {
      const font = await subsetFont(readFileSync(`${DIR}/${file}`), text, { targetFormat: 'woff2' })
      return `@font-face{font-family:'Google Sans Code';src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');unicode-range:${range}}`
    }),
  )
  return css.join('')
}
