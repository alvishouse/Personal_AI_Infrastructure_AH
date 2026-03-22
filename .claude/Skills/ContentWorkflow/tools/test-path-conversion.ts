#!/usr/bin/env bun

/**
 * Test path conversion from Linux to Windows WSL file:// URLs
 */

function linuxPathToWindowsFileUrl(linuxPath: string): string {
  const pathWithoutLeadingSlash = linuxPath.replace(/^\//, "");
  return `file://wsl.localhost/Ubuntu/${pathWithoutLeadingSlash}`;
}

// Test cases
const testPaths = [
  "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/posts/01-authority-post.md",
  "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion",
  "/home/alvis/PAI/.claude/Skills/ContentWorkflow/tools/notion-sync.ts"
];

console.log("🧪 Testing Linux → Windows WSL URL Conversion\n");

testPaths.forEach((path, i) => {
  const converted = linuxPathToWindowsFileUrl(path);
  console.log(`Test ${i + 1}:`);
  console.log(`  Input:  ${path}`);
  console.log(`  Output: ${converted}`);
  console.log();
});

console.log("✅ All paths converted successfully!");
console.log("\n💡 To test in Windows Explorer:");
console.log("   1. Copy one of the Output URLs above");
console.log("   2. Open File Explorer");
console.log("   3. Paste into the address bar");
console.log("   4. Press Enter");
