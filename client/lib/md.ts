type LineElement = string
  | { type: 'header'; level: number; text: string }
  | { type: 'styled'; text: string; bold?: boolean; italic?: boolean; strike?: boolean }
  | { type: 'code'; multiline: boolean; lang?: string; text: string }
type Line = LineElement[]
export function mdparse(content: string) {
  const segments = mdsplit(content)
  let currentLine: Line = []
  const lines = [currentLine]
  while(true) {
    const seg = segments.shift()
    if (!seg) break
    if ('~*`'.includes(seg[0])) {
      const multiline = seg[0] !== '*' && currentLine.length === 0 && seg.length >= 3
      const ss: string[] = []
      while (true) {
        const s = segments.shift()
        if (!multiline && (!s || s === '\n')) {
          currentLine.push(seg + ss.join(''))
          lines.push(currentLine = [])
          break
        }
        if (!s || s === seg) {
          if (seg[0] === '*') {
            const mode = (seg.length - 1) % 3
            currentLine.push({
              type:'styled',
              italic: mode !== 0,
              bold: mode !== 1,
              text: ss.join('')
            })
          } else if (seg[0] === '~' && seg.length <= 2) {
            currentLine.push({
              type:'styled',
              strike: true,
              text: ss.join('')
            })
          }else {
            const text = ss.join('')
            const idx = multiline ? text.indexOf('\n') : -1
            if (idx >= 0) {
              currentLine.push({
                type: 'code',
                multiline: true,
                lang: text.substr(0, idx),
                text: text.substr(idx + 1)
              })
            } else {
              currentLine.push({ type: 'code', multiline: false, text })
            }
          }
          if (multiline) lines.push(currentLine = [])
          break
        }
        ss.push(s)
      }
    } else if (seg[0] === '#' && seg.match(/#+ /)) {
      const ss: string[] = []
      while (true) {
        const s = segments.shift()
        if (!s || s === '\n') break
        ss.push(s)
      }
      currentLine.push({
        type: 'header', level: seg.length, text: ss.join('')
      })
      lines.push(currentLine = [])
    } else if (seg[0] === '\n'){
      lines.push(currentLine = [])
    } else {
      currentLine.push(seg)
    }
  }
  return lines
}

function mdsplit(content: string) {
  const pattern = /~+|\*+|`+|^#{1,6} |\n/g
  let index = 0
  const segments: string[] = []
  while(true) {
    const match = pattern.exec(content)
    if (!match) break
    if (index !== match.index) {
      segments.push(content.substring(index, match.index))
    }
    segments.push(match[0])
    index = match.index + match[0].length
  }
  if (index !== content.length) {
    segments.push(content.substr(index))
  }
  return segments
}
