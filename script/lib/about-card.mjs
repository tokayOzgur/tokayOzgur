import { escapeXml, palette, panelFrame, svgRoot } from "./theme.mjs";
import { wrapText } from "./text.mjs";

const width = 830;
const padding = 24;
const lineHeight = 18;
const firstBaseline = 31;
const sectionGap = 26;
const bottomPadding = 20;
const markerIndent = 16;
const summaryCharMax = 104;
const highlightCharMax = 100;
const markerColorList = [palette.cyan, palette.magenta, palette.yellow];

function textLineMarkup({ x, y, line }) {
  return `<text class="mono" x="${x}" y="${y}" font-size="12" fill="${palette.text}">${escapeXml(line)}</text>`;
}

export function buildAboutCard({ summary, highlightList }) {
  const summaryLineList = wrapText(summary, { charMax: summaryCharMax, lineMax: 3 });
  const summaryMarkup = summaryLineList
    .map((line, index) => textLineMarkup({ x: padding, y: firstBaseline + index * lineHeight, line }))
    .join("\n");

  const highlightTop = firstBaseline + (summaryLineList.length - 1) * lineHeight + sectionGap;
  let highlightBaseline = highlightTop;
  const highlightMarkup = highlightList
    .map((highlight, index) => {
      const [line] = wrapText(highlight, { charMax: highlightCharMax, lineMax: 1 });
      const y = highlightTop + index * lineHeight;
      highlightBaseline = y;
      return `<text class="mono" x="${padding}" y="${y}" font-size="12" font-weight="700" fill="${markerColorList[index % markerColorList.length]}">▸</text>
${textLineMarkup({ x: padding + markerIndent, y, line })}`;
    })
    .join("\n");

  const height = highlightBaseline + bottomPadding;
  const body = `${panelFrame({ width, height, color: palette.cyan })}
${summaryMarkup}
${highlightMarkup}`;

  return svgRoot({ width, height, title: `About: ${summary}`, body });
}
