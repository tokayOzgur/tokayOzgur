import { escapeXml, palette } from "./theme.mjs";

export const chipHeight = 20;
export const chipGap = 6;
const charWidth = 6.6;

export function measureChip(text) {
  return Math.ceil(text.length * charWidth + 16);
}

export function layoutChip(textList, { left, right, rowMax }) {
  const placementList = [];
  let x = left;
  let row = 0;
  for (const text of textList) {
    const chipWidth = measureChip(text);
    if (x + chipWidth > right) {
      row += 1;
      x = left;
    }
    if (row >= rowMax) break;
    placementList.push({ text, x, row, chipWidth });
    x += chipWidth + chipGap;
  }
  return placementList;
}

export function buildChip({ text, x, y, chipWidth, color }) {
  return `<rect x="${x}" y="${y}" width="${chipWidth}" height="${chipHeight}" rx="2" fill="${color}" fill-opacity="0.08" stroke="${color}" stroke-opacity="0.5"/>
<text class="mono" x="${x + chipWidth / 2}" y="${y + 14}" font-size="11" text-anchor="middle" fill="${palette.text}">${escapeXml(text)}</text>`;
}
