import { highlight } from 'highlight.js'

const alias: Record<string, string> = {
  tsx: 'jsx'
}

export function highlightCode(lang: string, code: string) {
  lang = alias[lang] || lang
  try {
    return highlight(lang, code).value
  } catch {
    return code
  }
}

function highlightLines(lang: string, code: string) {
  const html = highlightCode(lang, code)
  const lines = splitIntoLines(html)
  return lines.map(line =>
    line.map(
      ({ text, classes }) => {
        if (classes.length) {
          return `<span class="${classes.join(' ')}">${text}</span>`
        } else {
          return `<span>${text}</span>`
        }
      }
    ).join('') || '<span>\n</span>'
  )
}

function splitIntoLines(html: string) {
  const classes: string[] = []
  let currentLine: { text: string; classes: string[] }[] = []
  const lines = [currentLine]
  const matches = html.match(/<span class="[^"]+">|<\/span>|[^<]+/g)
  if (!matches) return []
  matches.forEach(seg => {
    if (seg[0] == '<') {
      if (seg[1] == '/') {
        classes.pop()
      } else {
        classes.push(seg.match(/<span class="([^"]+)">/)![1])
      }
    } else {
      const ls = seg.split('\n')
      ls.forEach((text, i) => {
        if (text) currentLine.push({ text, classes: [...classes] })
        if (i + 1 < ls.length) lines.push(currentLine = [])
      })
    }
  })
  if (lines[lines.length - 1].length === 0) lines.pop()
  return lines
}

export default highlightLines
