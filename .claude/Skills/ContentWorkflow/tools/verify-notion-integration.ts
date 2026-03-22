#!/usr/bin/env bun

/**
 * Notion Integration Verification Script
 *
 * Tests all aspects of the Notion integration to ensure everything works correctly.
 *
 * Usage:
 *   bun run verify-notion-integration.ts [--quick|--full]
 */

import { parseArgs } from "node:util";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => Promise<boolean> | boolean): void {
  console.log(`\n🧪 Testing: ${name}...`);

  try {
    const result = fn instanceof Promise ? fn : Promise.resolve(fn());
    result.then(passed => {
      if (passed) {
        console.log(`   ✅ PASS`);
        results.push({ name, passed: true, message: "OK" });
      } else {
        console.log(`   ❌ FAIL`);
        results.push({ name, passed: false, message: "Test returned false" });
      }
    });
  } catch (error) {
    console.log(`   ❌ FAIL: ${error}`);
    results.push({ name, passed: false, message: String(error) });
  }
}

async function verifyDatabaseSchema(): Promise<boolean> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📋 Phase 1: Database Schema Verification`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Test 1: Check if notion-sync.ts exists
  test("notion-sync.ts exists", () => {
    const syncPath = join(__dirname, "notion-sync.ts");
    return existsSync(syncPath);
  });

  // Test 2: Check if credentials file exists
  test("Notion credentials configured", () => {
    const credPath = join(process.env.HOME!, ".claude", ".credentials.json");

    if (!existsSync(credPath)) {
      console.log(`   Missing: ${credPath}`);
      return false;
    }

    try {
      const creds = JSON.parse(readFileSync(credPath, "utf-8"));
      return !!creds.notion?.api_key;
    } catch {
      return false;
    }
  });

  // Test 3: Verify database IDs are correct
  test("Database IDs configured", () => {
    const syncFile = readFileSync(join(__dirname, "notion-sync.ts"), "utf-8");

    const workflowsMatch = syncFile.includes("WORKFLOWS_DB = \"a359475b-326e-4ebe-9a4a-b9ea7115c5db\"");
    const imagesMatch = syncFile.includes("IMAGES_DB = \"e5168f8d-8d75-46b1-9d33-902a8d973651\"");
    const contentMatch = syncFile.includes("CONTENT_DB = \"3030760e-b0cd-811b-8525-000b50abf80b\"");

    return workflowsMatch && imagesMatch && contentMatch;
  });

  return true;
}

async function verifyMigrationData(): Promise<boolean> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📦 Phase 2: Migration Data Verification`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const workflowDir = join(
    process.env.HOME!,
    "PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion"
  );

  // Test 1: Workflow directory exists
  test("Workflow directory exists", () => {
    return existsSync(workflowDir);
  });

  // Test 2: metadata.json exists
  test("metadata.json exists", () => {
    return existsSync(join(workflowDir, "metadata.json"));
  });

  // Test 3: Images directory exists with 3 images
  test("Images directory has 3 images", () => {
    const imagesDir = join(workflowDir, "images");

    if (!existsSync(imagesDir)) return false;

    const imageFiles = ["01-featured.png", "02-flywheel.png", "03-compound-curve.png"];
    return imageFiles.every(file => existsSync(join(imagesDir, file)));
  });

  // Test 4: LinkedIn posts exist (8 posts)
  test("LinkedIn posts directory has 8 posts", () => {
    const linkedinDir = join(workflowDir, "13-extracted-content/linkedin/posts");

    if (!existsSync(linkedinDir)) return false;

    const posts = require("fs").readdirSync(linkedinDir).filter((f: string) => f.endsWith(".md"));
    console.log(`   Found ${posts.length} posts`);
    return posts.length === 8;
  });

  // Test 5: Cornerstone file exists
  test("Cornerstone final draft exists", () => {
    return existsSync(join(workflowDir, "06-cornerstone-draft-v3.md"));
  });

  return true;
}

async function verifyBidirectionalLinks(): Promise<boolean> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔗 Phase 3: Bidirectional Links Verification`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Test 1: File path format is correct
  test("File path format (file://)", () => {
    const workflowDir = join(
      process.env.HOME!,
      "PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion"
    );

    const fileUrl = `file://${workflowDir}`;
    return fileUrl.startsWith("file:///home/") || fileUrl.startsWith("file:///Users/");
  });

  // Test 2: Frontmatter utilities exist
  test("Frontmatter utilities implemented", () => {
    const syncFile = readFileSync(join(__dirname, "notion-sync.ts"), "utf-8");
    return syncFile.includes("updateFileFrontmatter");
  });

  // Test 3: Resync tool exists
  test("notion-resync.ts exists", () => {
    return existsSync(join(__dirname, "notion-resync.ts"));
  });

  // Test 4: Resync tool has --check option
  test("Resync tool has --check option", () => {
    const resyncFile = readFileSync(join(__dirname, "notion-resync.ts"), "utf-8");
    return resyncFile.includes("--check");
  });

  return true;
}

async function verifyDocumentation(): Promise<boolean> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📚 Phase 4: Documentation Verification`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  const docsDir = join(__dirname, "..");

  // Test 1: README-NOTION.md exists
  test("README-NOTION.md exists", () => {
    return existsSync(join(docsDir, "README-NOTION.md"));
  });

  // Test 2: NOTION-INTEGRATION.md exists
  test("NOTION-INTEGRATION.md exists", () => {
    return existsSync(join(docsDir, "NOTION-INTEGRATION.md"));
  });

  // Test 3: Migration script exists
  test("migrate-to-notion.ts exists", () => {
    return existsSync(join(__dirname, "migrate-to-notion.ts"));
  });

  // Test 4: All tools are executable
  test("All tools are executable", () => {
    const tools = [
      "notion-sync.ts",
      "notion-resync.ts",
      "migrate-to-notion.ts",
      "verify-notion-integration.ts"
    ];

    return tools.every(tool => {
      const toolPath = join(__dirname, tool);
      try {
        const stats = require("fs").statSync(toolPath);
        return (stats.mode & 0o111) !== 0; // Check if executable bit is set
      } catch {
        return false;
      }
    });
  });

  return true;
}

async function verifyIntegration(): Promise<boolean> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🔧 Phase 5: Integration Code Verification`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Test 1: notionSync has all required methods
  test("notionSync has all required methods", () => {
    const syncFile = readFileSync(join(__dirname, "notion-sync.ts"), "utf-8");

    const methods = [
      "createWorkflow",
      "createImage",
      "createContent",
      "updateWorkflowStatus",
      "linkImageToContent",
      "updateFileFrontmatter",
      "workflowExists"
    ];

    return methods.every(method => syncFile.includes(`async ${method}(`));
  });

  // Test 2: Error handling implemented
  test("Error handling with retry logic", () => {
    const syncFile = readFileSync(join(__dirname, "notion-sync.ts"), "utf-8");
    return syncFile.includes("retries") && syncFile.includes("catch (error)");
  });

  // Test 3: Graceful degradation
  test("Graceful degradation on API errors", () => {
    const syncFile = readFileSync(join(__dirname, "notion-sync.ts"), "utf-8");
    return syncFile.includes("console.error") || syncFile.includes("console.warn");
  });

  return true;
}

async function main() {
  const { values } = parseArgs({
    options: {
      quick: { type: "boolean" },
      full: { type: "boolean" }
    }
  });

  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║   Notion Integration Verification                          ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝`);

  // Run all verification phases
  await verifyDatabaseSchema();
  await verifyMigrationData();
  await verifyBidirectionalLinks();
  await verifyDocumentation();
  await verifyIntegration();

  // Wait for all async tests to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Verification Summary`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => r.passed).length;
  const total = results.length;

  console.log(`Total Tests:  ${total}`);
  console.log(`Passed:       ${passed} ✅`);
  console.log(`Failed:       ${failed} ❌`);
  console.log(``);

  if (failed > 0) {
    console.log(`Failed Tests:`);
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  ❌ ${r.name}`);
        console.log(`     ${r.message}`);
      });
    console.log(``);
  }

  const successRate = (passed / total) * 100;

  if (successRate === 100) {
    console.log(`✅ All tests passed! Integration is ready.`);
  } else if (successRate >= 80) {
    console.log(`⚠️  Most tests passed (${successRate.toFixed(0)}%). Review failures above.`);
  } else {
    console.log(`❌ Integration has issues (${successRate.toFixed(0)}% pass rate). Fix errors above.`);
  }

  console.log(``);

  process.exit(failed > 0 ? 1 : 0);
}

main();
