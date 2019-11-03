const coords = [{x:0.972,y:0},{x:0.952,y:0.098},{x:0.904,y:0.186},{x:0.843,y:0.265},{x:0.775,y:0.339},{x:0.704,y:0.409},{x:0.63,y:0.477},{x:0.555,y:0.543},{x:0.478,y:0.608},{x:0.4,y:0.671},{x:0.32,y:0.732},{x:0.239,y:0.79},{x:0.154,y:0.844},{x:0.066,y:0.891},{x:-0.029,y:0.924},{x:-0.128,y:0.924},{x:-0.206,y:0.864},{x:-0.247,y:0.773},{x:-0.274,y:0.676},{x:-0.334,y:0.602},{x:-0.433,y:0.589},{x:-0.533,y:0.593},{x:-0.634,y:0.601},{x:-0.734,y:0.607},{x:-0.833,y:0.602},{x:-0.926,y:0.567},{x:-0.974,y:0.484},{x:-0.934,y:0.394},{x:-0.867,y:0.322},{x:-0.935,y:0.25},{x:-0.976,y:0.161},{x:-0.934,y:0.072},{x:-0.867,y:0},{x:-0.934,y:-0.072},{x:-0.976,y:-0.161},{x:-0.935,y:-0.25},{x:-0.867,y:-0.322},{x:-0.934,y:-0.394},{x:-0.974,y:-0.484},{x:-0.926,y:-0.567},{x:-0.833,y:-0.602},{x:-0.734,y:-0.607},{x:-0.634,y:-0.601},{x:-0.533,y:-0.593},{x:-0.433,y:-0.589},{x:-0.334,y:-0.602},{x:-0.274,y:-0.676},{x:-0.247,y:-0.773},{x:-0.206,y:-0.864},{x:-0.128,y:-0.924},{x:-0.029,y:-0.924},{x:0.066,y:-0.891},{x:0.154,y:-0.844},{x:0.239,y:-0.79},{x:0.32,y:-0.732},{x:0.4,y:-0.671},{x:0.478,y:-0.608},{x:0.555,y:-0.543},{x:0.63,y:-0.477},{x:0.704,y:-0.409},{x:0.775,y:-0.339},{x:0.843,y:-0.265},{x:0.904,y:-0.186},{x:0.952,y:-0.098}]
// JSON.stringify(coords.map(c=>({x:Math.round((c.x-0.3)/1.3*1000)/1000,y:Math.round(c.y/1.3*1000)/1000}))).replace(/"/g,'')
type Point = { x: number; y: number }

function coordsToPath(baseCoords: Point[], { rotate, scale }: { rotate?: number; scale?: number } = {} ) {
  const cos = Math.cos(rotate || 0)
  const sin = Math.sin(rotate || 0)
  const s = scale === undefined ? 1 : scale
  const coords = baseCoords.map(({x, y}) => ({
    x: (x * cos - y * sin) * s,
    y: (x * sin + y * cos) * s
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

export function applyRippleStyle() {
  const path = coordsToPath(coords, { rotate: -Math.PI / 3, scale: 0.8 })
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.textContent=`
  .MuiTouchRipple-child{
    background-image: url('data:image/svg+xml,<svg width="100px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="${path}"/></svg>');
    background-size: contain;
    border-radius: 0;
  }
  `
}
