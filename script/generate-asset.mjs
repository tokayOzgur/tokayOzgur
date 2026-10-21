import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildAboutCard } from "./lib/about-card.mjs";
import { buildContributionCard } from "./lib/contribution-card.mjs";
import { fetchProfile } from "./lib/github-client.mjs";
import { buildLanguageCard } from "./lib/language-card.mjs";
import { buildMetricCard } from "./lib/metric-card.mjs";
import { buildProjectCard } from "./lib/project-card.mjs";
import { buildCoreStackCard, buildFocusCard } from "./lib/stack-card.mjs";
import { buildTerminalLine } from "./lib/terminal-line.mjs";
import { palette } from "./lib/theme.mjs";

const login = process.env.PROFILE_LOGIN ?? "tokayOzgur";
const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
const outputDirectory = new URL(process.env.ASSET_DIRECTORY ?? "../asset/", import.meta.url);

function readData(fileName) {
  return JSON.parse(readFileSync(new URL(`./data/${fileName}`, import.meta.url), "utf8"));
}

const projectList = readData("project.json");
const profileData = readData("profile.json");

function buildStaticCardMap() {
  const cardMap = new Map([
    ["about.svg", buildAboutCard(profileData.about)],
    ["core-stack.svg", buildCoreStackCard(profileData)],
    ["engineering-focus.svg", buildFocusCard(profileData)],
    [
      "analytic-terminal.svg",
      buildTerminalLine({ prompt: "tokay@github:~$", command: `gh analyze --user ${login} --live` }),
    ],
    [
      "project-terminal.svg",
      buildTerminalLine({ prompt: "tokay@github:~$", command: "ls ./project --status=live", color: palette.magenta }),
    ],
  ]);
  for (const project of projectList) {
    cardMap.set(`project-${project.slug}.svg`, buildProjectCard(project));
  }
  return cardMap;
}

async function buildLiveCardMap() {
  if (!token) {
    console.warn("GITHUB_TOKEN is not set: live cards (metric, contribution, language) were skipped.");
    return new Map();
  }
  const profile = await fetchProfile({ login, token });
  return new Map([
    ["metric.svg", buildMetricCard(profile)],
    ["contribution.svg", buildContributionCard(profile)],
    ["language.svg", buildLanguageCard(profile)],
  ]);
}

const cardMap = new Map([...buildStaticCardMap(), ...(await buildLiveCardMap())]);

mkdirSync(outputDirectory, { recursive: true });
for (const [fileName, svg] of cardMap) {
  writeFileSync(new URL(fileName, outputDirectory), svg);
}
console.log(`Wrote ${cardMap.size} file to ${outputDirectory.pathname}`);
