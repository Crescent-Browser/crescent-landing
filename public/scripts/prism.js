/* Copyright 2026 Crescent Authors. BSD-style license in Chromium's LICENSE.
 * Canvas port of chromium/crescent/prism_mark.cc PaintFacetField, with the
 * exact SidebarFacetWash constants from prism_views.cc. Native reference
 * sidebar width: 240 logical px. This is a web illustration, not a capture.
 */
(() => {
  const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
  const sub = (a, b) => a.map((v, i) => v - b[i]);
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot = (a, b) => a.reduce((sum, v, i) => sum + v*b[i], 0);
  const mix = (a, b, t) => a.map((v, i) => v + (b[i]-v)*t);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function random(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function paint(canvas, mono) {
    const sidebar = canvas.parentElement;
    const w = 240, h = w * sidebar.clientHeight / sidebar.clientWidth;
    if (!Number.isFinite(h) || h < 1) return;
    const key = `${mono}/${h.toFixed(2)}`;
    if (canvas.dataset.paintKey === key) return;
    canvas.dataset.paintKey = key;
    const scale = 2;
    canvas.width = w * scale; canvas.height = Math.ceil(h * scale);
    const ctx = canvas.getContext('2d'); ctx.scale(scale, scale);
    const cell = 38, rnd = random(9);
    const cols = Math.ceil(w / cell) + 2, rows = Math.ceil(h / cell) + 2;
    const pts = Array.from({length:rows}, (_,y) => Array.from({length:cols}, (_,x) => {
      const edge = x===0 || y===0 || x===cols-1 || y===rows-1;
      const jx = edge ? 0 : (rnd()-.5)*.7, jy = edge ? 0 : (rnd()-.5)*.7;
      return [(x-1+jx)*cell,(y-1+jy)*cell,rnd()*cell*.9];
    }));
    const A = mono ? [58,65,80] : [139,108,255];
    const B = mono ? [138,147,161] : [60,240,197], D = [11,13,20];
    const L = norm([-.4,.5,.8]), H = norm([L[0],L[1],L[2]+1]);
    const alpha = Math.floor((mono ? .16 : .2)*255)/255;
    let count = 0;
    for (let y=0;y<rows-1;y++) for (let x=0;x<cols-1;x++) {
      const a=pts[y][x], b=pts[y][x+1], c=pts[y+1][x+1], d=pts[y+1][x];
      const pair = (x+y)%2 ? [[a,b,c],[a,c,d]] : [[a,b,d],[b,c,d]];
      for (const t of pair) {
        const n = norm(cross(sub(t[1],t[0]),sub(t[2],t[0]))); n[2]=Math.abs(n[2]);
        const nn=[n[0],-n[1],n[2]], lam=Math.max(0,dot(nn,L));
        const sp=Math.pow(Math.max(0,dot(nn,H)),30);
        const mx=(t[0][0]+t[1][0]+t[2][0])/3/w, my=(t[0][1]+t[1][1]+t[2][1])/3/h;
        const tone=mix(mix(A,B,clamp(mx*.8+my*.3,0,1)),D,Math.min(.85,my*.6));
        const col=mix(tone.map(v=>v*(.24+.52*lam)),[255,255,255],sp*.22);
        ctx.fillStyle=`rgba(${col.map(v=>Math.trunc(clamp(v,0,255))).join(',')},${alpha})`;
        ctx.beginPath();ctx.moveTo(t[0][0],t[0][1]);ctx.lineTo(t[1][0],t[1][1]);ctx.lineTo(t[2][0],t[2][1]);ctx.closePath();ctx.fill();count++;
      }
    }
    canvas.dataset.facetCount = count;
    canvas.dataset.mode = mono ? 'mono' : 'spectrum';
  }
  const observer = new ResizeObserver(entries => entries.forEach(({target}) => {
    const browser = target.closest('.browser');
    if (browser.dataset.nativeTheme==='prism') paint(target.querySelector('.prism-wash'),browser.dataset.nativeMode==='mono');
  }));
  document.querySelectorAll('.browser aside').forEach(sidebar => {
    const canvas=document.createElement('canvas'); canvas.className='prism-wash';canvas.setAttribute('aria-hidden','true');
    sidebar.prepend(canvas);observer.observe(sidebar);
  });
  window.CrescentPaintPrism = () => document.querySelectorAll('.browser[data-native-theme="prism"] .prism-wash').forEach(canvas => paint(canvas,canvas.closest('.browser').dataset.nativeMode==='mono'));
})();
