import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build } from "vite";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = resolve(rootDir, "dist");
const sourceComponentsDir = resolve(rootDir, "src/components");
const rootJs = resolve(distDir, "index.js");
const rootTypes = resolve(distDir, "index.d.ts");
const styles = resolve(distDir, "grey-ui.css");
const legacyRootJs = resolve(distDir, "grey-ui.js");
const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8"));
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
  { name: "button", exportName: "Button" },
  { name: "input", exportName: "Input" },
  { name: "select", exportName: "Select" },
  { name: "menu", exportName: "Menu" },
  { name: "combobox", exportName: "Combobox" },
];
const allowedRuntimeExternal = /^(?:react(?:\/.*)?|react-dom(?:\/.*)?)$/;
const rootEntryImport = /(?:from\s*|import\s*(?:\(\s*)?)["'](?:\.\.\/)+index\.js["']/;

function fail(message) {
  failures.push(message);
}

function requireFile(path, label) {
  if (!existsSync(path)) {
    fail(`Missing ${label}: ${relative(rootDir, path)}`);
  }
}

function formatBytes(bytes) {
  if (Math.abs(bytes) < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} kB`;
}

function listJsFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listJsFiles(path));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(path);
    }
  }
  return files;
}

function bareRuntimeImports(source) {
  const imports = new Set();
  const pattern = /(?:from\s*|import\s*(?:\(\s*)?)["']([^"'.\/][^"']*)["']/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    imports.add(match[1]);
  }

  return imports;
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

async function bundleConsumer(source) {
  const result = await build({
    configFile: false,
    logLevel: "silent",
    plugins: [packageResolver(source)],
    build: {
      emptyOutDir: false,
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
      files += 1;
      raw += Buffer.byteLength(item.code);
      gzip += gzipSync(item.code).length;
    }
  }

  return { files, raw, gzip };
}

if (!existsSync(distDir)) {
  console.error("dist/ does not exist. Run `npm run build` first.");
  process.exit(1);
}

requireFile(rootJs, "root JavaScript entrypoint");
requireFile(rootTypes, "root declaration entrypoint");
requireFile(styles, "shared stylesheet");
if (existsSync(legacyRootJs)) {
  fail("Legacy dist/grey-ui.js bundle still exists; the package should use one shared entry graph");
}

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
  for (const file of listJsFiles(distDir)) {
    const source = readFileSync(file, "utf8");
    for (const specifier of bareRuntimeImports(source)) {
      if (!allowedRuntimeExternal.test(specifier)) {
        fail(`${relative(distDir, file)} leaves unexpected runtime external ${specifier}`);
      }
    }
    if (file !== rootJs && rootEntryImport.test(source)) {
      fail(`${relative(distDir, file)} imports the root index.js entrypoint`);
    }
  }

  console.log("Component consumer bundle cost:");
  console.log(
    `${"entry".padEnd(26)} ${"files".padStart(5)} ${"raw".padStart(10)} ${"gzip".padStart(10)}`,
  );

  for (const name of componentNames) {
    const metrics = await bundleConsumer(`export * from "greyui/components/${name}";`);
    if (lightComponents.has(name) && metrics.gzip > LIGHT_COMPONENT_GZIP_BUDGET) {
      fail(
        `components/${name} exceeds lightweight ${formatBytes(LIGHT_COMPONENT_GZIP_BUDGET)} gzip budget: ${formatBytes(metrics.gzip)}`,
      );
    }
    console.log(
      `${`components/${name}`.padEnd(26)} ${String(metrics.files).padStart(5)} ${formatBytes(metrics.raw).padStart(10)} ${formatBytes(metrics.gzip).padStart(10)}`,
    );
  }

  console.log("\nRoot import equivalence:");
  console.log(
    `${"component".padEnd(14)} ${"root gzip".padStart(10)} ${"subpath".padStart(10)} ${"delta".padStart(10)}`,
  );

  for (const { name, exportName } of consumerCases) {
    const rootBundle = await bundleConsumer(`export { ${exportName} } from "greyui";`);
    const subpathBundle = await bundleConsumer(
      `export { ${exportName} } from "greyui/components/${name}";`,
    );
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
} else {
  console.log("\nPackage entrypoint checks passed.");
}
