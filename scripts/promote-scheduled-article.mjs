import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const todayArg = args.find((arg) => arg.startsWith("--today="))?.slice("--today=".length);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

if (todayArg && !datePattern.test(todayArg)) {
  throw new Error("--today must use YYYY-MM-DD");
}

function shanghaiToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

const today = todayArg || shanghaiToday();
const contentDir = join(process.cwd(), "content", "news");
const candidates = [];

for (const file of await readdir(contentDir)) {
  if (!file.endsWith(".mdoc")) continue;
  const path = join(contentDir, file);
  const source = await readFile(path, "utf8");
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) continue;
  const status = frontmatter[1].match(/^status:\s*(["']?)([\w-]+)\1\s*$/m)?.[2];
  const publishAt = frontmatter[1].match(/^publishAt:\s*(["']?)(\d{4}-\d{2}-\d{2})\1\s*$/m)?.[2];
  if (status !== "scheduled") continue;
  if (!publishAt) throw new Error(`${file} is scheduled but has no publishAt date`);
  if (publishAt <= today) candidates.push({ file, path, source, frontmatter: frontmatter[1], publishAt });
}

candidates.sort((a, b) => a.publishAt.localeCompare(b.publishAt) || a.file.localeCompare(b.file));
const next = candidates[0];

if (!next) {
  console.log("");
  console.error(`No scheduled article is due on ${today} (Asia/Shanghai).`);
  process.exit(0);
}

const updatedFrontmatter = next.frontmatter.replace(/^(status:\s*)(["']?)scheduled\2\s*$/m, "$1published");
if (updatedFrontmatter === next.frontmatter) throw new Error(`Could not update status in ${next.file}`);

if (!dryRun) {
  const updated = next.source.replace(next.frontmatter, updatedFrontmatter);
  await writeFile(next.path, updated, "utf8");
}

console.log(next.file.replace(/\.mdoc$/, ""));
console.error(`${dryRun ? "Would publish" : "Promoted"} ${next.file} scheduled for ${next.publishAt}; checked on ${today} (Asia/Shanghai).`);
