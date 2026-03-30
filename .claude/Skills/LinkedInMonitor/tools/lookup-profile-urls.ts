/**
 * lookup-profile-urls.ts — Look up LinkedIn profile URLs for creators with missing linkedin_url.
 *
 * Uses LinkdAPI /api/v1/profile/overview to validate usernames and retrieve
 * canonical profile data. Prints a review table — does NOT auto-update config.
 *
 * After reviewing, run with --write to update monitor-config.json.
 *
 * Usage:
 *   cd /home/alvis/PAI && bun --env-file .claude/.env run .claude/Skills/LinkedInMonitor/tools/lookup-profile-urls.ts
 *   cd /home/alvis/PAI && bun --env-file .claude/.env run .claude/Skills/LinkedInMonitor/tools/lookup-profile-urls.ts --write
 */

import { join } from "path";

const SKILL_DIR = join(import.meta.dir, "..");
const CONFIG_PATH = join(SKILL_DIR, "config", "monitor-config.json");
const BASE_URL = "https://linkdapi.com";

// Best-guess LinkedIn usernames for each creator.
// Confidence: HIGH = very public figure with known handle
//             MED  = reasonable guess, needs API verification
//             LOW  = uncertain, may not resolve
const CANDIDATE_USERNAMES: Record<string, { username: string; confidence: string }> = {
  // Large Creators
  "Ethan Mollick":        { username: "emollick",             confidence: "HIGH" },
  "Allie Miller":         { username: "alliekmiller",          confidence: "MED" },
  "Cassie Kozyrkov":      { username: "kozyrkov",              confidence: "HIGH" },
  "Bernard Marr":         { username: "bernardmarr",           confidence: "HIGH" },
  "Paul Roetzer":         { username: "paulroetzer",           confidence: "HIGH" },
  "Thomas H. Davenport":  { username: "davenporttom",          confidence: "MED" },
  "Gary Vaynerchuk":      { username: "garyvaynerchuk",        confidence: "HIGH" },
  "Adam Grant":           { username: "adammgrant",            confidence: "HIGH" },
  "Liz Fosslien":         { username: "liz-fosslien",          confidence: "HIGH" },
  "Charlene Li":          { username: "charleneli",            confidence: "MED" },

  // Peers
  "Amanda Natividad":     { username: "amandanat",             confidence: "MED" },
  "Katelyn Bourgoin":     { username: "katelynbourgoin",       confidence: "MED" },
  "Steph Smith":          { username: "stephsmith",            confidence: "HIGH" },
  "Dave Kellogg":         { username: "davekellogg",           confidence: "MED" },
  "Mike Weiss":           { username: "mikeweiss",             confidence: "LOW" },
  "Chris Do":             { username: "thechrisdo",            confidence: "MED" },
  "Wes Kao":              { username: "weskao",                confidence: "MED" },
  "Louis Grenier":        { username: "lougrenier",            confidence: "MED" },

  // ICP
  "Isaac Sacolick":       { username: "isaacsacolick",         confidence: "HIGH" },
  "Vala Afshar":          { username: "valaafshar",            confidence: "HIGH" },
  "R Ray Wang":           { username: "rwang0",                confidence: "HIGH" },
  "Greg Verdino":         { username: "gregverdino",           confidence: "MED" },
  "Cathy Hackl":          { username: "cathyhackl",            confidence: "HIGH" },
  "Mike Quindazzi":       { username: "mikequindazzi",         confidence: "HIGH" },
  "David Mattin":         { username: "davidmattin",           confidence: "LOW" },
  "Jeanne Ross":          { username: "jeanneross",            confidence: "HIGH" },
  "Tomas Chamorro-Premuzic": { username: "tcpremuzic",         confidence: "LOW" },
  "Tendayi Viki":         { username: "tendayiviki",           confidence: "MED" },
};

interface ProfileOverview {
  full_name?: string;
  headline?: string;
  profile_url?: string;
  username?: string;
  followers?: number;
}

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

async function lookupProfile(
  apiKey: string,
  username: string
): Promise<ProfileOverview | null> {
  try {
    const resp = await fetch(
      `${BASE_URL}/api/v1/profile/overview?username=${encodeURIComponent(username)}`,
      {
        headers: { "X-linkdapi-apikey": apiKey },
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (resp.status === 404) return null;
    if (resp.status === 429) {
      console.warn(`[lookup] Rate limit hit — pausing 10s`);
      await new Promise((r) => setTimeout(r, 10_000));
      return null;
    }
    if (!resp.ok) {
      console.warn(`[lookup] HTTP ${resp.status} for username: ${username}`);
      return null;
    }

    const data = await resp.json() as { data?: ProfileOverview };
    return data.data ?? null;
  } catch (err) {
    console.warn(`[lookup] Request failed for ${username}:`, err);
    return null;
  }
}

async function main() {
  const writeMode = process.argv.includes("--write");
  const apiKey = getEnv("LINKDAPI_API_KEY");

  const configFile = Bun.file(CONFIG_PATH);
  const config = JSON.parse(new TextDecoder().decode(await configFile.bytes()));

  const pendingProfiles = config.watched_profiles.filter(
    (p: { linkedin_url: string }) => !p.linkedin_url
  );

  console.log("═".repeat(70));
  console.log(`LinkedIn Profile URL Lookup — ${pendingProfiles.length} profiles pending`);
  if (writeMode) console.log("MODE: --write (will update config after review)");
  else console.log("MODE: review only (run with --write to update config)");
  console.log("═".repeat(70));

  const results: Array<{
    name: string;
    candidate: string;
    confidence: string;
    resolvedName: string;
    resolvedUrl: string;
    followers: number;
    status: "FOUND" | "NOT_FOUND" | "SKIPPED";
  }> = [];

  for (const profile of pendingProfiles) {
    const candidate = CANDIDATE_USERNAMES[profile.name];

    if (!candidate) {
      console.log(`\n[lookup] ${profile.name} — no candidate username, skipping`);
      results.push({
        name: profile.name,
        candidate: "—",
        confidence: "—",
        resolvedName: "—",
        resolvedUrl: "—",
        followers: 0,
        status: "SKIPPED",
      });
      continue;
    }

    process.stdout.write(`[lookup] ${profile.name} (trying: ${candidate.username})... `);
    const data = await lookupProfile(apiKey, candidate.username);

    if (data) {
      const url = data.profile_url ?? `https://www.linkedin.com/in/${candidate.username}/`;
      console.log(`✓ Found: ${data.full_name} (${data.followers?.toLocaleString() ?? "?"} followers)`);
      results.push({
        name: profile.name,
        candidate: candidate.username,
        confidence: candidate.confidence,
        resolvedName: data.full_name ?? "?",
        resolvedUrl: url,
        followers: data.followers ?? 0,
        status: "FOUND",
      });
    } else {
      console.log(`✗ Not found`);
      results.push({
        name: profile.name,
        candidate: candidate.username,
        confidence: candidate.confidence,
        resolvedName: "—",
        resolvedUrl: "—",
        followers: 0,
        status: "NOT_FOUND",
      });
    }

    // Polite delay between requests — 5s to avoid rate limiting
    await new Promise((r) => setTimeout(r, 5_000));
  }

  // Print review table
  console.log("\n" + "═".repeat(70));
  console.log("RESULTS\n");

  const found = results.filter((r) => r.status === "FOUND");
  const notFound = results.filter((r) => r.status === "NOT_FOUND");
  const skipped = results.filter((r) => r.status === "SKIPPED");

  if (found.length) {
    console.log(`✓ FOUND (${found.length}):`);
    for (const r of found) {
      console.log(`  ${r.name.padEnd(30)} → ${r.resolvedName.padEnd(30)} ${r.resolvedUrl}`);
    }
  }

  if (notFound.length) {
    console.log(`\n✗ NOT FOUND (${notFound.length}) — username guesses that didn't resolve:`);
    for (const r of notFound) {
      console.log(`  ${r.name.padEnd(30)} tried: ${r.candidate}`);
    }
  }

  if (skipped.length) {
    console.log(`\n— SKIPPED (${skipped.length}) — no candidate username in script:`);
    for (const r of skipped) {
      console.log(`  ${r.name}`);
    }
  }

  // Write mode — update config with resolved URLs
  if (writeMode) {
    const resolved = found;
    if (!resolved.length) {
      console.log("\n[write] Nothing to write.");
      return;
    }

    const urlMap = Object.fromEntries(resolved.map((r) => [r.name, r.resolvedUrl]));
    let updatedCount = 0;

    for (const profile of config.watched_profiles) {
      if (urlMap[profile.name]) {
        profile.linkedin_url = urlMap[profile.name];
        updatedCount++;
      }
    }

    await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");
    console.log(`\n[write] Updated ${updatedCount} profile URLs in monitor-config.json`);
    console.log("[write] Review the NOT FOUND entries above and add their URLs manually.");
  } else {
    console.log("\nRun with --write to update monitor-config.json with found URLs.");
  }

  console.log("═".repeat(70));
}

main().catch((err) => {
  console.error("[lookup] Fatal error:", err);
  process.exit(1);
});
