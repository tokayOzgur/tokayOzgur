import { escapeXml, palette, panelFrame, svgRoot } from "./theme.mjs";

const width = 830;
const height = 44;
const padding = 20;
const charWidth = 8.4;
const stepSecond = 0.07;

export function buildTerminalLine({ prompt, command, color = palette.cyan }) {
  const commandX = padding + (prompt.length + 1) * charWidth;
  const commandWidth = command.length * charWidth;
  const stepList = Array.from({ length: command.length + 1 }, (_, index) =>
    (index * charWidth).toFixed(1),
  );
  const cursorXList = stepList.map((step) => (commandX + Number(step)).toFixed(1));
  const duration = (command.length * stepSecond).toFixed(2);

  const body = `${panelFrame({ width, height, color, cut: 10 })}
<clipPath id="reveal"><rect x="${commandX}" y="0" width="0" height="${height}"><animate attributeName="width" values="${stepList.join(";")}" calcMode="discrete" dur="${duration}s" begin="0.4s" fill="freeze"/></rect></clipPath>
<text class="mono" x="${padding}" y="28" font-size="14" fill="${palette.green}" textLength="${prompt.length * charWidth}" lengthAdjust="spacing">${escapeXml(prompt)}</text>
<text class="mono" x="${commandX}" y="28" font-size="14" fill="${palette.text}" textLength="${commandWidth}" lengthAdjust="spacing" clip-path="url(#reveal)">${escapeXml(command)}</text>
<rect class="blink" x="${commandX}" y="13" width="${charWidth}" height="18" fill="${color}" filter="url(#glow)"><animate attributeName="x" values="${cursorXList.join(";")}" calcMode="discrete" dur="${duration}s" begin="0.4s" fill="freeze"/></rect>`;

  return svgRoot({ width, height, title: `${prompt} ${command}`, body });
}
