export const palette = {
  text: "#e9e4ff",
  muted: "#8f86b3",
  cyan: "#00f0ff",
  magenta: "#ff2a6d",
  violet: "#9d4edd",
  yellow: "#f9f002",
  green: "#05ffa1",
  orange: "#ff9e00",
};

export const accentColor = {
  rose: palette.magenta,
  green: palette.green,
  blue: palette.cyan,
  amber: palette.yellow,
};

const baseStyle = `
.mono{font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,'Courier New',monospace}
.trace{stroke-dasharray:70 930;animation:trace 7s linear infinite}
.glitch{animation:glitch 5s steps(1,end) infinite}
.flicker{animation:flicker 6s steps(1,end) infinite}
.blink{animation:blink 1.1s steps(1,end) infinite}
@keyframes trace{to{stroke-dashoffset:-1000}}
@keyframes glitch{0%,90%,100%{transform:translate(0,0)}91%{transform:translate(-2px,1px)}93%{transform:translate(2px,-1px)}95%{transform:translate(-1px,0)}}
@keyframes flicker{0%,94%,100%{opacity:1}95%{opacity:.4}96%{opacity:1}97%{opacity:.55}98%{opacity:1}}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function hexId(seed) {
  let hash = 2166136261;
  for (const character of seed) {
    hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  }
  return `0x${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 4)}`;
}

export function svgRoot({ width, height, title, body, extraStyle = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
<title>${escapeXml(title)}</title>
<defs>
<filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><feGaussianBlur stdDeviation="2.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<pattern id="scanline" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#ffffff" opacity="0.045"/></pattern>
<linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d0420"/><stop offset="1" stop-color="#190838"/></linearGradient>
</defs>
<style>${baseStyle}${extraStyle}</style>
${body}
</svg>
`;
}

export function panelFrame({ width, height, color, cut = 14 }) {
  const outline = `M${cut},1 H${width - 1} V${height - cut} L${width - cut},${height - 1} H1 V${cut} Z`;
  return `<path d="${outline}" fill="url(#panel)"/>
<path d="${outline}" fill="url(#scanline)"/>
<path d="${outline}" fill="none" stroke="${color}" stroke-opacity="0.5" stroke-width="1.2"/>
<path class="trace" d="${outline}" pathLength="1000" fill="none" stroke="${color}" stroke-width="2.4" filter="url(#glow)"/>`;
}

export function cardHeader({ width, padding, left, right, color }) {
  return `<text class="mono flicker" x="${padding}" y="34" font-size="13" font-weight="700" letter-spacing="2.5" fill="${color}" filter="url(#glow)">${escapeXml(left)}</text>
<text class="mono" x="${width - padding}" y="34" font-size="11" letter-spacing="1.5" text-anchor="end" fill="${palette.muted}">${escapeXml(right)}</text>
<line x1="${padding}" y1="46" x2="${width - padding}" y2="46" stroke="${color}" stroke-opacity="0.35" stroke-width="1"/>`;
}
