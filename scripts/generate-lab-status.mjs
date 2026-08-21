import { mkdir, writeFile } from "node:fs/promises";

const username = process.env.GITHUB_PROFILE_USER || "Bum-Boo";
const output = new URL("../assets/lab-status.svg", import.meta.url);
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "bum-boo-profile-lab-status",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${path}`);
  return response.json();
}

const repositories = await github(`/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&per_page=100`);

const publicRepos = repositories.filter((repo) => !repo.private && !repo.fork && !repo.archived);
const now = Date.now();
const active = publicRepos.filter((repo) => now - Date.parse(repo.pushed_at) < 30 * 86400000);
const latest = publicRepos.slice(0, 3);
const languages = new Map();
for (const repo of publicRepos) {
  if (repo.language) languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
}
const topLanguages = [...languages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
const updated = new Intl.DateTimeFormat("en-CA", { timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const recentRows = latest.map((repo, index) => `
  <g transform="translate(632 ${156 + index * 38})">
    <circle cx="5" cy="-5" r="5" fill="${["#7b2d3e", "#315b4e", "#b7523a"][index]}"/>
    <text x="24" y="0" class="name">${escapeXml(repo.name)}</text>
    <text x="486" y="0" text-anchor="end" class="meta">${escapeXml(repo.language || "mixed")}</text>
  </g>`).join("");
const languageText = topLanguages.map(([name, count]) => `${name} ${count}`).join("  ·  ") || "exploring";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="390" viewBox="0 0 1200 390" role="img" aria-labelledby="title desc">
  <title id="title">Bum-Boo studio note</title>
  <desc id="desc">A factual snapshot of current public repository work generated from GitHub data.</desc>
  <style>
    .serif{font-family:Georgia,"Times New Roman",serif;fill:#28241f}
    .sans{font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;fill:#59534b}
    .label{font-size:14px}.date{font-size:14px}.value{font:36px Georgia,"Times New Roman",serif;fill:#28241f}
    .name{font:600 15px Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;fill:#35312c}
    .meta{font:14px Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;fill:#746c62}
  </style>
  <rect x="1" y="1" width="1198" height="388" rx="6" fill="#f3efe6" stroke="#cec5b8" stroke-width="2"/>
  <text x="56" y="58" class="serif" font-size="34">Studio note</text>
  <text x="1144" y="58" text-anchor="end" class="sans date">Generated ${escapeXml(updated)} UTC from public GitHub data</text>
  <line x1="56" y1="82" x2="1144" y2="82" stroke="#c9c0b4"/>
  <g transform="translate(56 122)"><text class="sans label">Public repositories</text><text y="52" class="value">${publicRepos.length}</text></g>
  <g transform="translate(300 122)"><text class="sans label">Active in the last 30 days</text><text y="52" class="value">${active.length}</text></g>
  <line x1="566" y1="108" x2="566" y2="334" stroke="#c9c0b4"/>
  <text x="56" y="246" class="sans label">Current working question</text>
  <text x="56" y="284" class="serif" font-size="22">How can AI expand capability</text>
  <text x="56" y="314" class="serif" font-size="22">without hiding human choice?</text>
  <text x="632" y="120" class="sans label">Recent public work</text>${recentRows}
  <text x="632" y="286" class="sans label">Working languages</text>
  <text x="632" y="320" class="name">${escapeXml(languageText)}</text>
  <rect x="56" y="354" width="64" height="6" fill="#7b2d3e"/><rect x="126" y="354" width="64" height="6" fill="#315b4e"/><rect x="196" y="354" width="64" height="6" fill="#b7523a"/>
</svg>`;

await mkdir(new URL("../assets/", import.meta.url), { recursive: true });
await writeFile(output, svg, "utf8");
console.log(`generated ${output.pathname}`);
