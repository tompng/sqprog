const coords = [{x:0.972,y:0},{x:0.952,y:0.098},{x:0.904,y:0.186},{x:0.843,y:0.265},{x:0.775,y:0.339},{x:0.704,y:0.409},{x:0.63,y:0.477},{x:0.555,y:0.543},{x:0.478,y:0.608},{x:0.4,y:0.671},{x:0.32,y:0.732},{x:0.239,y:0.79},{x:0.154,y:0.844},{x:0.066,y:0.891},{x:-0.029,y:0.924},{x:-0.128,y:0.924},{x:-0.206,y:0.864},{x:-0.247,y:0.773},{x:-0.274,y:0.676},{x:-0.334,y:0.602},{x:-0.433,y:0.589},{x:-0.533,y:0.593},{x:-0.634,y:0.601},{x:-0.734,y:0.607},{x:-0.833,y:0.602},{x:-0.926,y:0.567},{x:-0.974,y:0.484},{x:-0.934,y:0.394},{x:-0.867,y:0.322},{x:-0.935,y:0.25},{x:-0.976,y:0.161},{x:-0.934,y:0.072},{x:-0.867,y:0},{x:-0.934,y:-0.072},{x:-0.976,y:-0.161},{x:-0.935,y:-0.25},{x:-0.867,y:-0.322},{x:-0.934,y:-0.394},{x:-0.974,y:-0.484},{x:-0.926,y:-0.567},{x:-0.833,y:-0.602},{x:-0.734,y:-0.607},{x:-0.634,y:-0.601},{x:-0.533,y:-0.593},{x:-0.433,y:-0.589},{x:-0.334,y:-0.602},{x:-0.274,y:-0.676},{x:-0.247,y:-0.773},{x:-0.206,y:-0.864},{x:-0.128,y:-0.924},{x:-0.029,y:-0.924},{x:0.066,y:-0.891},{x:0.154,y:-0.844},{x:0.239,y:-0.79},{x:0.32,y:-0.732},{x:0.4,y:-0.671},{x:0.478,y:-0.608},{x:0.555,y:-0.543},{x:0.63,y:-0.477},{x:0.704,y:-0.409},{x:0.775,y:-0.339},{x:0.843,y:-0.265},{x:0.904,y:-0.186},{x:0.952,y:-0.098}]
const eyeOuterCoords = [{x:0.031,y:0},{x:0.077,y:0.246},{x:-0.077,y:0.5},{x:-0.4,y:0.5},{x:-0.538,y:0.246},{x:-0.492,y:0},{x:-0.538,y:-0.246},{x:-0.4,y:-0.5},{x:-0.077,y:-0.5},{x:0.077,y:-0.246}]
const eyeCircleOuter = { x: -0.215, y: 0.231, r: 0.262 }
const eyeCircleInner = { x: -0.169, y: 0.231, r: 0.169 }
const svgOpenTag = '<svg width="100px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg">'
const svgCloseTag = '</svg>'
type Point = { x: number; y: number }

function IconGood() {
  svgOpenTag
  return svgOpenTag + `
    <path fill="#4f4" d="${coordsToPath(coords, { rotate: -Math.PI / 2, scale: 1 })}" />
    <path fill="#464" d="${coordsToPath(eyeOuterCoords, { rotate: -Math.PI / 2, scale: 1 })}" />
    <circle fill="#afa" cx="${50 - 50 * eyeCircleOuter.y}" cy="${50 - 50 * eyeCircleOuter.x}" r="${50 * eyeCircleOuter.r}" />
    <circle fill="#afa" cx="${50 + 50 * eyeCircleOuter.y}" cy="${50 - 50 * eyeCircleOuter.x}" r="${50 * eyeCircleOuter.r}" />
    <circle fill="#464" cx="${50 - 50 * eyeCircleInner.y}" cy="${50 - 50 * eyeCircleInner.x}" r="${50 * eyeCircleInner.r}" />
    <circle fill="#464" cx="${50 + 50 * eyeCircleInner.y}" cy="${50 - 50 * eyeCircleInner.x}" r="${50 * eyeCircleInner.r}" />
    <circle fill="#afa" cx="42" cy="56" r="2" />
    <circle fill="#afa" cx="64" cy="56" r="2" />
  ` + svgCloseTag
}

function IconBad() {
  return svgOpenTag + `
    <path fill="#f44" d="${coordsToPath(coords, { rotate: Math.PI / 2, scale: 1 })}" />
    <path fill="#844" d="${coordsToPath(eyeOuterCoords, { rotate: Math.PI / 2, scale: 1 })}" />
    <g transform="translate(50,38) rotate(24)">
      <rect fill="#400" x="-22" y="-3" width="44" height="6" />
    </g>
    <g transform="translate(50,38) rotate(-24)">
      <rect fill="#400" x="-22" y="-3" width="44" height="6" />
    </g>
  ` + svgCloseTag
}

function IconForward() {
  const outLoc = { x: 0.1, y: 0, rotate: Math.PI / 6, scale: 0.9 }
  const inLoc = { x: 0.1, y: 0, rotate: -Math.PI / 6, scale: 0.6 }
  return svgOpenTag + `
    <path fill="#8af" d="${coordsToPath(coords, outLoc)}" />
    <path fill="#fab" d="${coordsToPath(coords, inLoc)}" />
    <path fill="#cad" d="${coordsToPath(eyeOuterCoords, inLoc)}" />
  ` + svgCloseTag
}

function IconRotate() {
  const rotcoords = coords.map(rot)
  const roteyes = eyeOuterCoords.map(rot)
  function rot({ x, y }: Point) {
    const r = (y + 3) / 2
    const th = x / 1.8
    return {
      x: r * Math.cos(th) - 1,
      y: r * Math.sin(th)
    }
  }
  const loc1 = { x: 0, y: 0, rotate: 2 * Math.PI / 3, scale: 1 }
  const loc2 = { x: 0, y: 0, rotate: 5 * Math.PI / 3, scale: 1 }
  return svgOpenTag + `
    <path fill="#fb0" d="${coordsToPath(rotcoords, loc1)}" />
    <path fill="#fd0" d="${coordsToPath(roteyes, loc1)}" />
    <path fill="#ff0" d="${coordsToPath(rotcoords, loc2)}" />
    <path fill="#fd0" d="${coordsToPath(roteyes, loc2)}" />
  ` + svgCloseTag
}


(window as any).svg = IconGood() + IconBad() + IconForward() + IconRotate()

function coordsToPath(baseCoords: Point[], { x: baseX, y: baseY, rotate, scale }: { x?: number; y?: number; rotate?: number; scale?: number } = {} ) {
  const cos = Math.cos(rotate || 0)
  const sin = Math.sin(rotate || 0)
  const s = scale === undefined ? 1 : scale
  const coords = baseCoords.map(({x, y}) => ({
    x: (baseX || 0) + (x * cos - y * sin) * s,
    y: (baseY || 0) + (x * sin + y * cos) * s
  }))
  const xs = toBezierParams(coords.map(c => c.x), true)
  const ys = toBezierParams(coords.map(c => c.y), true)
  const path = []
  const c = (x: number) => `${Math.round((50 + 50 * x) * 10) / 10}`
  path.push(`M${c(xs[0].v)} ${c(ys[0].v)}`)
  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length
    path.push(`C${c(xs[i].v + xs[i].d / 3)} ${c(ys[i].v + ys[i].d / 3)}`)
    path.push(`${c(xs[j].v - xs[j].d / 3)} ${c(ys[j].v - ys[j].d / 3)}`)
    path.push(`${c(xs[j].v)} ${c(ys[j].v)}`)
  }
  path.push('Z')
  return path.join(' ')
}
function toBezierParams(values: number[], closed?: boolean) {
  const out = values.map(v => { return { v, d: 0 } })
  for (let n = 0; n < 4; n++) {
    for (let i = 0; i < out.length; i++) {
      let ia = i - 1
      let ib = i + 1
      if (ia === -1) ia = closed ? values.length - 1 : i
      if (ib === values.length) ib = closed ? 0 : i
      const k = ia === i || ib === i ? 2 : 4
      out[i].d = (3 * (out[ib].v - out[ia].v) - out[ia].d - out[ib].d) / k
    }
  }
  return out
}

function roundShapeCoords(n: number, ratio: number = 1.2) {
  const coords = []
  for (let i = 0; i < n; i++) {
    const th = 2 * Math.PI * i / n
    const r = [ratio, 1 / ratio][i % 2]
    coords.push({ x: Math.cos(th) * r, y: Math.sin(th) * r })
  }
  return coords
}

function color(t: number, from: number = 0, to: number = 1, alpha: number = 1) {
  function f(t: number) {
    t = (t % 1 + 1) % 1
    return t < 1 / 3 ? 1 : t < 2 / 3 ? 2 - 3 * t : 3 * t - 2
  }
  function c(v: number) { return Math.round((from + (to - from) * v) * 255) }
  return `rgba(${c(f(t))},${c(f(t+1/3))},${c(f(t+2/3))},${Math.round(100 * alpha) / 100})`
}

export function genIconSVG(seed: string='0123456789abcdef') {
  let seedIndex = 0
  function readHex() {
    const a = seed[seedIndex % seed.length].charCodeAt(0)
    seedIndex++
    return (a >= 64 ? 9 + a : a) % 16
  }
  function randomBool() {
    return randomInt(2) === 1
  }
  function randomInt(n: number) {
    const a = readHex()
    if (n == 2 || n == 4 || n == 8 || n == 16) return a % n
    const b = a * 16 + readHex()
    return b % n
  }
  function randomFloat(from: number, to: number, highRes: boolean = false) {
    const t = highRes ? (16 * readHex() + readHex()) / 255 : readHex() / 15
    return from + (to - from) * t
  }
  const paths = []
  const baseColor = randomFloat(0, 1, true)
  const baseShapeN = [3, 4, 5, 6][randomInt(4)]
  const shapeRatio = randomFloat(0.5, 1.5)
  const baseShape = roundShapeCoords(baseShapeN * 2, 1 + shapeRatio / baseShapeN)
  paths.push(`<rect x="0" y="0" width="100" height="100" fill="${color(baseColor, 0.8)}" />`)
  for (let i = 0; i < 12; i++) {
    const path = coordsToPath(baseShape, {
      x: randomFloat(-0.8, 0.8, true),
      y: randomFloat(-0.8, 0.8, true),
      scale: 0.2 + 0.2 * (1 - i / 12) ** 2,
      rotate: randomFloat(0, 2 * Math.PI, true)
    })
    const cscale = randomFloat(0.08, 0.16)
    paths.push(`<path d="${path}" fill="${color(randomFloat(baseColor - 0.2, baseColor + 0.2, true), 0.84 - cscale, 0.84 + cscale, 0.8)}" />`)
  }
  const [numSquids, sizeFrom, sizeTo, distFrom, distTo] = [
    [1, 0.6, 0.8, 0, 0.2],
    [2, 0.5, 0.6, 0.3, 0.4],
    [3, 0.4, 0.5, 0.35, 0.5]
  ][randomInt(3)]
  const mixBaseShape = numSquids >= 2 && randomBool()
  const posBaseTheta = randomFloat(0, 2 * Math.PI)
  for (let i = 0; i < numSquids; i++) {
    const nobi = randomFloat(0.9, 1.3)
    const magari = randomFloat(-0.3, 0.3)
    let shape
    if (i === 0 && mixBaseShape) {
      const accentShapeN = [6, 5][randomInt(2)]
      shape = roundShapeCoords(accentShapeN * 2, 1 + shapeRatio / accentShapeN)
    } else {
      shape = coords.map(({ x, y }) => {
        x *= nobi
        y /= nobi
        let dy = 1
        let dx = -2 * x * magari
        const dr = Math.sqrt(dx ** 2 + dy ** 2)
        dx /= dr
        dy /= dr
        return {
          x: x + y * dx,
          y: y * dy + x * x * magari,
        }
      })
    }
    const th = posBaseTheta + 2 * Math.PI * i / numSquids
    const r = randomFloat(distFrom, distTo)
    const path = coordsToPath(shape, {
      rotate: randomFloat(0, 2 * Math.PI, true),
      scale: randomFloat(sizeFrom, sizeTo),
      x: r * Math.cos(th),
      y: r * Math.sin(th)
    })
    const col = color(randomFloat(baseColor + 0.2, baseColor + 0.8, true), randomFloat(0, (i + 1) / numSquids))
    paths.push(
      `<path d="${path}" fill="${col}" />`
    )
  }
  return svgOpenTag + paths.join('') + svgCloseTag
}

export function randomString(){
  let s = ''
  while (s.length < 64) s += Math.random().toString(16).substr(2)
  return s.substring(0, 64)
}

export function applyRippleStyle() {
  const path = coordsToPath(coords, { rotate: -Math.PI / 3, scale: 0.8 })
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.textContent=`
  .MuiTouchRipple-child{
    background-image: url('data:image/svg+xml,${svgOpenTag}<path fill="rgba(255, 255, 255, 0.5)" d="${path}"/>${svgCloseTag}');
    background-size: contain;
    border-radius: 0;
  }
  `
}
