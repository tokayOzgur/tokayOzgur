import { cardHeader, palette, panelFrame, svgRoot } from "./theme.mjs";

const width = 830;
const height = 206;
const padding = 24;
const cellSize = 11;
const cellPitch = 14;
const gridTop = 64;
const pulseGroupCount = 6;

const levelColorList = ["#251a4a", "#3b1d8f", "#8a2be2", palette.magenta, palette.cyan];

function quartileThresholdList(countList) {
  const sorted = countList.filter((count) => count > 0).sort((left, right) => left - right);
  if (sorted.length === 0) return [];
  return [0.25, 0.5, 0.75].map((ratio) => sorted[Math.floor((sorted.length - 1) * ratio)]);
}

function levelOf(count, thresholdList) {
  if (count === 0) return 0;
  const passed = thresholdList.filter((threshold) => count > threshold).length;
  return Math.min(passed + 1, 4);
}

export function buildContributionCard(profile) {
  const countList = profile.weekList.flat().map((day) => day.contributionCount);
  const thresholdList = quartileThresholdList(countList);
  const gridWidth = profile.weekList.length * cellPitch - (cellPitch - cellSize);
  const gridLeft = (width - gridWidth) / 2;
  const gridHeight = 7 * cellPitch - (cellPitch - cellSize);

  const cellMarkup = profile.weekList
    .flatMap((week, weekIndex) =>
      week.map((day, dayIndex) => {
        const level = levelOf(day.contributionCount, thresholdList);
        const pulse = level >= 3 ? ` class="pulse g${(weekIndex + dayIndex) % pulseGroupCount}"` : "";
        return `<rect${pulse} x="${gridLeft + weekIndex * cellPitch}" y="${gridTop + dayIndex * cellPitch}" width="${cellSize}" height="${cellSize}" rx="2" fill="${levelColorList[level]}"/>`;
      }),
    )
    .join("\n");

  const legendX = width - padding - levelColorList.length * cellPitch - 62;
  const legendMarkup = levelColorList
    .map(
      (color, index) =>
        `<rect x="${legendX + 34 + index * cellPitch}" y="${height - 30}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}"/>`,
    )
    .join("\n");

  const pulseStyle = `
.pulse{animation:pulse 3.2s ease-in-out infinite}
${Array.from({ length: pulseGroupCount }, (_, index) => `.g${index}{animation-delay:${(index * 0.5).toFixed(1)}s}`).join("")}
.sweep{animation:sweep 7s linear infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes sweep{from{transform:translateX(0)}to{transform:translateX(${gridWidth}px)}}`;

  const body = `${panelFrame({ width, height, color: palette.magenta })}
${cardHeader({ width, padding, left: "// CONTRIBUTION.MATRIX", right: `${profile.contributionTotal.toLocaleString("en-US")} CONTRIBUTIONS // LAST 365 DAYS`, color: palette.magenta })}
${cellMarkup}
<rect class="sweep" x="${gridLeft}" y="${gridTop - 4}" width="2" height="${gridHeight + 8}" fill="${palette.cyan}" opacity="0.7" filter="url(#glow)"/>
<text class="mono" x="${legendX}" y="${height - 21}" font-size="10" letter-spacing="1.2" fill="${palette.muted}">LESS</text>
${legendMarkup}
<text class="mono" x="${legendX + 34 + levelColorList.length * cellPitch + 6}" y="${height - 21}" font-size="10" letter-spacing="1.2" fill="${palette.muted}">MORE</text>`;

  return svgRoot({
    width,
    height,
    title: `Contribution activity of ${profile.login}`,
    body,
    extraStyle: pulseStyle,
  });
}
