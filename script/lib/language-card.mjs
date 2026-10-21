import { cardHeader, escapeXml, palette, panelFrame, svgRoot } from "./theme.mjs";

const width = 830;
const height = 206;
const padding = 24;
const barTop = 66;
const barHeight = 12;
const languageMax = 6;
const columnCount = 3;
const rowHeight = 28;
const legendTop = 112;

const languageColorList = [
  palette.cyan,
  palette.magenta,
  palette.yellow,
  palette.green,
  palette.violet,
  palette.orange,
];
const otherColor = palette.muted;

function toShareList(languageList) {
  const total = languageList.reduce((sum, language) => sum + language.size, 0);
  if (total === 0) return [];
  const shown = languageList.slice(0, languageMax).map((language, index) => ({
    name: language.name,
    share: language.size / total,
    color: languageColorList[index],
  }));
  const otherShare = 1 - shown.reduce((sum, language) => sum + language.share, 0);
  return otherShare > 0.0005
    ? [...shown, { name: "Other", share: otherShare, color: otherColor }]
    : shown;
}

export function buildLanguageCard(profile) {
  const shareList = toShareList(profile.languageList);
  const barWidth = width - padding * 2;
  const columnWidth = barWidth / columnCount;

  let cursor = padding;
  const segmentMarkup = shareList
    .map(({ share, color }) => {
      const segmentWidth = share * barWidth;
      const segment = `<rect x="${cursor.toFixed(1)}" y="${barTop}" width="${Math.max(segmentWidth - 2, 1).toFixed(1)}" height="${barHeight}" fill="${color}" filter="url(#glow)"/>`;
      cursor += segmentWidth;
      return segment;
    })
    .join("\n");

  const legendMarkup = shareList
    .map(({ name, share, color }, index) => {
      const x = padding + (index % columnCount) * columnWidth;
      const y = legendTop + Math.floor(index / columnCount) * rowHeight;
      return `<rect x="${x}" y="${y}" width="10" height="10" fill="${color}"/>
<text class="mono" x="${x + 18}" y="${y + 9}" font-size="12" fill="${palette.text}">${escapeXml(name)}</text>
<text class="mono" x="${x + columnWidth - 28}" y="${y + 9}" font-size="12" text-anchor="end" fill="${color}">${(share * 100).toFixed(1)}%</text>`;
    })
    .join("\n");

  const emptyMarkup =
    shareList.length === 0
      ? `<text class="mono" x="${padding}" y="${legendTop}" font-size="12" fill="${palette.muted}">NO LANGUAGE DATA</text>`
      : "";

  const body = `${panelFrame({ width, height, color: palette.green })}
${cardHeader({ width, padding, left: "// LANGUAGE.DISTRIBUTION", right: "BY CODE SIZE", color: palette.green })}
<rect x="${padding}" y="${barTop}" width="${barWidth}" height="${barHeight}" fill="#1a1133"/>
${segmentMarkup}
${legendMarkup}
${emptyMarkup}`;

  return svgRoot({ width, height, title: `Top languages of ${profile.login}`, body });
}
