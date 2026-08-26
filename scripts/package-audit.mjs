import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "vite";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = resolve(rootDir, "dist");
const sourceComponentsDir = resolve(rootDir, "src/components");
const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8"));
const shouldCheck = process.argv.includes("--check");
const failures = [];

const LIGHT_COMPONENT_GZIP_BUDGET = 2 * 1024;
const lightComponents = new Set([
  "badge",
  "button",
  "group-box",
  "input",
  "table",
  "toggle-button",
  "window",
]);
const consumerCases = [
  ["button", "Button"],
  ["input", "Input"],
  ["select", "Select"],
  ["menu", "Menu"],
  ["combobox", "Combobox"],
];

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

function hasBareBaseUiImport(path) {
  const source = readFileSync(path, "utf8");
  return /(?:from\s*|import\s*(?:\(\s*)?)["']@base-ui\/react(?:\/[^"']*)?["']/.test(source);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} kB`;
}

function packageResolver(source) {
  const virtualId = "virtual:greyui-consumer";
  const resolvedVirtualId = `\0${virtualId}`;
  const componentPrefix = "greyui/components/";

  return {
    name: "greyui-package-audit",
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
      if (id === "greyui") return rootJs;
      if (id.startsWith(componentPrefix)) {
        return resolve(distDir, `components/${id.slice(componentPrefix.length)}.js`);
      }
      return null;
    },
    load(id) {
      return id === resolvedVirtualId ? source : null;
    },
  };
}

async function bundleConsumer(specifier, exportName) {
  const source = `export { ${exportName} } from ${JSON.stringify(specifier)};`;
  const result = await build({
    configFile: false,
    logLevel: "silent",
    plugins: [packageResolver(source)],
    build: {
      write: false,
      minify: true,
      rolldownOptions: {
        input: "virtual:greyui-consumer",
        external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
        output: {
          format: "es",
          hoistTransitiveImports: false,
        },
      },
    },
  });

  const outputs = Array.isArray(result) ? result : [result];
  let files = 0;
  let raw = 0;
  let gzip = 0;

  for (const output of outputs) {
    for (const item of output.output) {
      if (item.type !== "chunk") continue;
      const contents = Buffer.from(item.code);
      files += 1;
      raw += contents.length;
      gzip += gzipSync(contents).length;
    }
  }

  return { files, raw, gzip };
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

const rootExport = packageJson.exports?.["."];
if (rootExport?.import !== "./dist/index.js" || rootExport?.types !== "./dist/index.d.ts") {
  fail("package.json root export does not match dist/index.js + dist/index.d.ts");
}

const componentExport = packageJson.exports?.["./components/*"];
if (
  componentExport?.import !== "./dist/components/*.js" ||
  componentExport?.types !== "./dist/components/*.d.ts"
) {
  fail("package.json ./components/* export does not match dist/components/*.js + *.d.ts");
}

const componentNames = readdirSync(sourceComponentsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")))
  .map((entry) => entry.name.replace(/\.tsx?$/, ""))
  .sort();

for (const name of componentNames) {
  requireFile(resolve(distDir, `components/${name}.js`), `${name} JavaScript entrypoint`);
  requireFile(resolve(distDir, `components/${name}.d.ts`), `${name} declaration entrypoint`);
}

if (failures.length === 0) {
  const rows = componentNames.map((name) => {
    const entry = resolve(distDir, `components/${name}.js`);
    const metrics = graphSize(entry);

    if (metrics.graph.has(rootJs)) {
      fail(`components/${name}.js reaches the root index.js entrypoint`);
    }
    if (lightComponents.has(name) && metrics.gzip > LIGHT_COMPONENT_GZIP_BUDGET) {
      fail(
        `components/${name} exceeds lightweight ${formatBytes(LIGHT_COMPONENT_GZIP_BUDGET)} gzip budget: ${formatBytes(metrics.gzip)}`,
      );
    }

    for (const file of metrics.graph) {
      if (hasBareBaseUiImport(file)) {
        fail(
          `components/${name} leaves Base UI external in ${relative(distDir, file)}; Base UI must stay bundled`,
        );
        break;
      }
    }

    return { name, files: metrics.files, raw: metrics.raw, gzip: metrics.gzip };
  });

  console.log("Component entrypoint load cost (entry + transitive local chunks):");
  console.log(
    `${"entry".padEnd(26)} ${"files".padStart(5)} ${"raw".padStart(10)} ${"gzip".padStart(10)}`,
  );
  for (const row of rows) {
    console.log(
      `${`components/${row.name}`.padEnd(26)} ${String(row.files).padStart(5)} ${formatBytes(row.raw).padStart(10)} ${formatBytes(row.gzip).padStart(10)}`,
    );
  }

  console.log("\nConsumer bundle equivalence (root import vs component subpath):");
  console.log(
    `${"component".padEnd(14)} ${"root gzip".padStart(10)} ${"subpath".padStart(10)} ${"delta".padStart(10)}`,
  );

  for (const [name, exportName] of consumerCases) {
    const rootBundle = await bundleConsumer("greyui", exportName);
    const subpathBundle = await bundleConsumer(`greyui/components/${name}`, exportName);
    const delta = rootBundle.gzip - subpathBundle.gzip;
    const allowedDelta = Math.max(128, Math.ceil(subpathBundle.gzip * 0.02));

    if (delta > allowedDelta) {
      fail(
        `Root import for ${exportName} is ${formatBytes(delta)} larger than the component subpath; allowed delta is ${formatBytes(allowedDelta)}`,
      );
    }

    console.log(
      `${name.padEnd(14)} ${formatBytes(rootBundle.gzip).padStart(10)} ${formatBytes(subpathBundle.gzip).padStart(10)} ${formatBytes(delta).padStart(10)}`,
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
