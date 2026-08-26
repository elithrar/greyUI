import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = resolve(rootDir, "dist");
const sourceComponentsDir = resolve(rootDir, "src/components");
const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8"));
const shouldCheck = process.argv.includes("--check");
const failures = [];

function fail(message) {
  failures.push(message);
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    fail(`Missing ${label}: ${relative(rootDir, path)}`);
    return false;
  }
  return true;
}

function relativeJsImports(path) {
  const source = readFileSync(path, "utf8");
  const imports = [];
  const pattern = /\b(?:from|import)\s*(?:\(\s*)?["']([^"']+\.js)["']/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    if (match[1].startsWith(".")) {
      imports.push(resolve(dirname(path), match[1]));
    }
  }

  return imports;
}

function collectGraph(entryPath, seen = new Set()) {
  const path = resolve(entryPath);
  if (seen.has(path) || !existsSync(path)) {
    return seen;
  }

  seen.add(path);
  for (const importedPath of relativeJsImports(path)) {
    collectGraph(importedPath, seen);
  }
  return seen;
}

function graphSize(entryPath) {
  const files = collectGraph(entryPath);
  let raw = 0;
  let gzip = 0;

  for (const file of files) {
    const contents = readFileSync(file);
    raw += statSync(file).size;
    gzip += gzipSync(contents).length;
  }

  return { files: files.size, raw, gzip, graph: files };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} kB`;
}

if (!existsSync(distDir)) {
  console.error("dist/ does not exist. Run `npm run build` first.");
  process.exit(1);
}

const rootJs = resolve(distDir, "index.js");
const rootTypes = resolve(distDir, "index.d.ts");
const styles = resolve(distDir, "grey-ui.css");
requireFile(rootJs, "root JavaScript entrypoint");
requireFile(rootTypes, "root declaration entrypoint");
requireFile(styles, "shared stylesheet");

const componentExport = packageJson.exports?.["./components/*"];
if (
  componentExport?.import !== "./dist/components/*.js" ||
  componentExport?.types !== "./dist/components/*.d.ts"
) {
  fail("package.json ./components/* export does not match dist/components/*.js + *.d.ts");
}

const componentNames = readdirSync(sourceComponentsDir, { withFileTypes: true })
  .filter(
    (entry) => entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")),
  )
  .map((entry) => entry.name.replace(/\.tsx?$/, ""))
  .sort();

for (const name of componentNames) {
  requireFile(resolve(distDir, `components/${name}.js`), `${name} JavaScript entrypoint`);
  requireFile(resolve(distDir, `components/${name}.d.ts`), `${name} declaration entrypoint`);
}

if (failures.length === 0) {
  const rootMetrics = graphSize(rootJs);
  const rows = componentNames.map((name) => {
    const entry = resolve(distDir, `components/${name}.js`);
    const metrics = graphSize(entry);

    if (metrics.graph.has(rootJs)) {
      fail(`components/${name}.js reaches the root index.js entrypoint`);
    }

    return { name, ...metrics };
  });

  console.log("Package entrypoint load cost (entry + transitive local chunks):");
  console.log(
    `${"entry".padEnd(26)} ${"files".padStart(5)} ${"raw".padStart(10)} ${"gzip".padStart(10)} ${"root %".padStart(8)}`,
  );
  console.log(
    `${"root".padEnd(26)} ${String(rootMetrics.files).padStart(5)} ${formatBytes(rootMetrics.raw).padStart(10)} ${formatBytes(rootMetrics.gzip).padStart(10)} ${"100.0%".padStart(8)}`,
  );

  for (const row of rows) {
    const ratio = rootMetrics.gzip === 0 ? 0 : (row.gzip / rootMetrics.gzip) * 100;
    console.log(
      `${`components/${row.name}`.padEnd(26)} ${String(row.files).padStart(5)} ${formatBytes(row.raw).padStart(10)} ${formatBytes(row.gzip).padStart(10)} ${`${ratio.toFixed(1)}%`.padStart(8)}`,
    );
  }
}

if (failures.length > 0) {
  console.error("\nPackage audit failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else if (shouldCheck) {
  console.log("\nPackage entrypoint checks passed.");
}
