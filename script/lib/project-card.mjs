import { buildChip, chipGap, chipHeight, layoutChip } from "./chip.mjs";
import { accentColor, escapeXml, hexId, palette, panelFrame, svgRoot } from "./theme.mjs";
import { wrapText } from "./text.mjs";

const width = 410;
const height = 222;
const padding = 20;
const chipRowMax = 2;
const taglineLineMax = 2;
const taglineCharMax = 50;
const siteHost = "otokay.com";

function platformLabel(platformList) {
  return platformList.map((platform) => platform.toUpperCase()).join(" + ");
}

function linkLabel(project) {
  if (!project.liveUrl) return { label: "CASE STUDY", target: siteHost };
  return { label: "LIVE", target: new URL(project.liveUrl).host.replace(/^www\./, "") };
}

export function buildProjectCard(project) {
  const color = accentColor[project.accent];
  const titleSize = project.title.length > 22 ? 18 : 22;
  const titleTextLength = Math.ceil(project.title.length * titleSize * 0.6);
  const taglineList = wrapText(project.tagline, { charMax: taglineCharMax, lineMax: taglineLineMax });
  const chipList = layoutChip(project.techList, { left: padding, right: width - padding, rowMax: chipRowMax });
  const { label, target } = linkLabel(project);

  const titleLayer = (fill, dx, opacity) =>
    `<text class="mono" x="${padding + dx}" y="70" font-size="${titleSize}" font-weight="800" fill="${fill}" fill-opacity="${opacity}" textLength="${titleTextLength}" lengthAdjust="spacing">${escapeXml(project.title)}</text>`;

  const taglineMarkup = taglineList
    .map(
      (line, index) =>
        `<text class="mono" x="${padding}" y="${96 + index * 18}" font-size="12" fill="${palette.muted}">${escapeXml(line)}</text>`,
    )
    .join("\n");

  const chipMarkup = chipList
    .map(({ text, x, row, chipWidth }) =>
      buildChip({ text, x, y: 132 + row * (chipHeight + chipGap), chipWidth, color }),
    )
    .join("\n");

  const body = `${panelFrame({ width, height, color })}
<rect x="${padding}" y="22" width="${project.category.length * 7.4 + 16}" height="18" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-opacity="0.6"/>
<text class="mono flicker" x="${padding + 8}" y="35" font-size="10.5" font-weight="700" letter-spacing="1.4" fill="${color}">${escapeXml(project.category)}</text>
<text class="mono" x="${width - padding}" y="35" font-size="10.5" letter-spacing="1.4" text-anchor="end" fill="${palette.muted}">${escapeXml(platformLabel(project.platformList))}</text>
<g class="glitch">
${titleLayer(palette.cyan, -1.5, 0.75)}
${titleLayer(palette.magenta, 1.5, 0.75)}
${titleLayer(palette.text, 0, 1)}
</g>
${taglineMarkup}
${chipMarkup}
<text class="mono" x="${padding}" y="${height - 16}" font-size="12" font-weight="700" fill="${color}" filter="url(#glow)">▸ ${label}</text>
<text class="mono" x="${padding + (label.length + 3) * 7.4}" y="${height - 16}" font-size="12" fill="${palette.text}">${escapeXml(target)}</text>
<rect class="blink" x="${padding + (label.length + 4 + target.length) * 7.4}" y="${height - 27}" width="7" height="13" fill="${color}"/>
<text class="mono" x="${width - 26}" y="${height - 12}" font-size="9" letter-spacing="1" text-anchor="end" fill="${palette.muted}" fill-opacity="0.7">${hexId(project.slug)}</text>`;

  return svgRoot({
    width,
    height,
    title: `${project.title} — ${project.tagline}`,
    body,
  });
}
