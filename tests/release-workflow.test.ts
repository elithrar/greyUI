import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("release workflow", () => {
  it("creates the version tag only after package validation", () => {
    const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/release.yml"), "utf8");
    const resolveVersion = workflow.indexOf("name: Resolve release version");
    const verifyDocs = workflow.indexOf("run: npm run verify:docs");
    const verifyPackage = workflow.indexOf("name: Verify package is publishable");
    const createTag = workflow.indexOf("name: Create validated release tag");
    const publish = workflow.indexOf("name: Publish to npm");

    expect(resolveVersion).toBeGreaterThanOrEqual(0);
    expect(verifyDocs).toBeGreaterThan(resolveVersion);
    expect(verifyPackage).toBeGreaterThan(resolveVersion);
    expect(verifyPackage).toBeGreaterThan(verifyDocs);
    expect(createTag).toBeGreaterThan(verifyPackage);
    expect(publish).toBeGreaterThan(createTag);

    const versionResolution = workflow.slice(resolveVersion, verifyPackage);
    expect(versionResolution).not.toContain('git tag "${expected_tag}"');
    expect(workflow).toContain(
      "if: steps.release.outputs.validate == 'true' && steps.release.outputs.publish != 'true'",
    );
    expect(workflow).toContain(
      "if: steps.release.outputs.publish == 'true'\n        run: npm publish",
    );
  });
});
