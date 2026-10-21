import { buildChip, chipGap, chipHeight, layoutChip } from "./chip.mjs";
import { palette, panelFrame, svgRoot } from "./theme.mjs";

const width = 830;
const padding = 24;
const labelDividerX = 110;
const chipLeft = 124;
const chipRight = width - padding;
const focusPaddingY = 14;

function resolveColor(name) {
  const color = palette[name];
  if (!color) throw new Error(`Unknown palette color: ${name}`);
  return color;
}

function layoutSingleRow(textList, title) {
  const placementList = layoutChip(textList, { left: chipLeft, right: chipRight, rowMax: 1 });
  if (placementList.length !== textList.length) {
    throw new Error(`Chip row does not fit in one line: ${title}`);
  }
  return placementList;
}

function labelMarkup({ label, y, color }) {
  return `<text class="mono flicker" x="${padding}" y="${y}" font-size="11" font-weight="700" letter-spacing="1.6" fill="${color}" filter="url(#glow)">${label}</text>`;
}

export function buildCoreStackCard({ coreStackList }) {
  const height = 52;
  const chipTop = (height - chipHeight) / 2;
  const colorByName = new Map(coreStackList.map(({ name, color }) => [name, resolveColor(color)]));
  const chipMarkup = layoutSingleRow([...colorByName.keys()], "core stack")
    .map(({ text, x, chipWidth }) => buildChip({ text, x, y: chipTop, chipWidth, color: colorByName.get(text) }))
    .join("\n");

  const body = `${panelFrame({ width, height, color: palette.cyan, cut: 10 })}
${labelMarkup({ label: "CORE STACK", y: chipTop + 14, color: palette.cyan })}
<line x1="${labelDividerX}" y1="14" x2="${labelDividerX}" y2="${height - 14}" stroke="${palette.muted}" stroke-opacity="0.35"/>
${chipMarkup}`;

  return svgRoot({
    width,
    height,
    title: `Core stack: ${coreStackList.map(({ name }) => name).join(", ")}`,
    body,
  });
}

export function buildFocusCard({ focusList }) {
  const rowPitch = chipHeight + chipGap;
  const height = focusPaddingY * 2 + focusList.length * rowPitch - chipGap;

  const rowMarkup = focusList
    .map(({ area, color, itemList }, index) => {
      const rowColor = resolveColor(color);
      const y = focusPaddingY + index * rowPitch;
      const chipMarkup = layoutSingleRow(itemList, area)
        .map(({ text, x, chipWidth }) => buildChip({ text, x, y, chipWidth, color: rowColor }))
        .join("\n");
      return `${labelMarkup({ label: area.toUpperCase(), y: y + 14, color: rowColor })}
${chipMarkup}`;
    })
    .join("\n");

  const body = `${panelFrame({ width, height, color: palette.magenta, cut: 10 })}
<line x1="${labelDividerX}" y1="${focusPaddingY}" x2="${labelDividerX}" y2="${height - focusPaddingY}" stroke="${palette.muted}" stroke-opacity="0.35"/>
${rowMarkup}`;

  return svgRoot({
    width,
    height,
    title: `Engineering focus: ${focusList.map(({ area, itemList }) => `${area} (${itemList.join(", ")})`).join("; ")}`,
    body,
  });
}
