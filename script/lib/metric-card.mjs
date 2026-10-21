import { cardHeader, escapeXml, palette, panelFrame, svgRoot } from "./theme.mjs";

const width = 830;
const height = 170;
const padding = 24;

function formatNumber(value) {
  return value.toLocaleString("en-US");
}

export function buildMetricCard(profile) {
  const metricList = [
    { label: "COMMIT", caption: "LAST 12 MONTHS", value: profile.commitCount, color: palette.cyan },
    { label: "PULL REQUEST", caption: "LAST 12 MONTHS", value: profile.pullRequestCount, color: palette.magenta },
    { label: "ISSUE", caption: "LAST 12 MONTHS", value: profile.issueCount, color: palette.yellow },
    { label: "REPOSITORY", caption: "OWNED", value: profile.repositoryCount, color: palette.green },
    { label: "STAR", caption: "EARNED", value: profile.starCount, color: palette.violet },
    { label: "FOLLOWER", caption: "TOTAL", value: profile.followerCount, color: palette.cyan },
  ];
  const tileWidth = (width - padding * 2) / metricList.length;

  const tileMarkup = metricList
    .map(({ label, caption, value, color }, index) => {
      const x = padding + index * tileWidth;
      const center = x + tileWidth / 2;
      const separator =
        index === 0
          ? ""
          : `<line x1="${x}" y1="70" x2="${x}" y2="146" stroke="${palette.muted}" stroke-opacity="0.25"/>`;
      return `${separator}
<text class="mono" x="${center}" y="76" font-size="10" letter-spacing="1.6" text-anchor="middle" fill="${palette.muted}">${escapeXml(label)}</text>
<text class="mono flicker" x="${center}" y="112" font-size="30" font-weight="800" text-anchor="middle" fill="${color}" filter="url(#glow)">${escapeXml(formatNumber(value))}</text>
<text class="mono" x="${center}" y="134" font-size="9" letter-spacing="1.4" text-anchor="middle" fill="${palette.muted}" fill-opacity="0.8">${escapeXml(caption)}</text>`;
    })
    .join("\n");

  const body = `${panelFrame({ width, height, color: palette.cyan })}
${cardHeader({ width, padding, left: "// SYSTEM.DIAGNOSTIC", right: `USER: ${profile.login}`, color: palette.cyan })}
${tileMarkup}`;

  return svgRoot({ width, height, title: `GitHub metrics of ${profile.login}`, body });
}
