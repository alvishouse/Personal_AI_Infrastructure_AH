#!/usr/bin/env bun

/**
 * WordPress Image Upload Tool
 *
 * Uploads local images from a workflow's 10-images/ directory to WordPress
 * media library using the WordPress REST API binary upload endpoint.
 *
 * WHY THIS EXISTS:
 * The WordPress MCP create_media tool requires a public source_url.
 * Local files cannot be uploaded that way. This tool uses basic auth
 * + binary upload to POST images directly to the WP REST API.
 *
 * Usage:
 *   bun run upload-images-to-wordpress.ts --workflow-id=2026-02-15-dumb-pipe-phenomenon
 *
 * Reads credentials from:
 *   ${PAI_DIR}/Skills/WordPressPublisher/config/wordpress-sites.json
 *
 * Saves media IDs to metadata.json under "wordpress.media_ids"
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, extname, basename } from 'path';

interface WordPressSite {
  url: string;
  username: string;
  password: string;
}

interface WordPressSitesConfig {
  sites: Record<string, WordPressSite>;
  active_site: string;
}

interface MediaUploadResult {
  id: number;
  source_url: string;
  filename: string;
  localPath: string;
}

async function uploadImageToWordPress(
  site: WordPressSite,
  localPath: string,
  filename: string
): Promise<MediaUploadResult> {
  const credentials = Buffer.from(`${site.username}:${site.password}`).toString('base64');
  const imageData = readFileSync(localPath);

  const ext = extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  const contentType = mimeTypes[ext] || 'image/png';

  const response = await fetch(`${site.url}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Type': contentType,
    },
    body: imageData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed for ${filename}: ${response.status} ${errorText}`);
  }

  const result = await response.json() as { id: number; source_url: string };
  return {
    id: result.id,
    source_url: result.source_url,
    filename,
    localPath,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const workflowIdArg = args.find(arg => arg.startsWith('--workflow-id='));

  if (!workflowIdArg) {
    console.error('Usage: upload-images-to-wordpress.ts --workflow-id=<workflow-id>');
    process.exit(1);
  }

  const workflowId = workflowIdArg.split('=')[1];
  const paiDir = process.env.PAI_DIR || '/home/alvis/.claude';
  const workflowDir = join(paiDir, '..', 'scratchpad', 'content-create', workflowId);
  const imagesDir = join(workflowDir, '10-images');
  const metadataPath = join(workflowDir, 'metadata.json');
  const sitesConfigPath = join(paiDir, 'Skills', 'WordPressPublisher', 'config', 'wordpress-sites.json');

  // Validate paths
  if (!existsSync(workflowDir)) throw new Error(`Workflow not found: ${workflowDir}`);
  if (!existsSync(imagesDir)) throw new Error(`Images directory not found: ${imagesDir}`);
  if (!existsSync(metadataPath)) throw new Error(`metadata.json not found: ${metadataPath}`);
  if (!existsSync(sitesConfigPath)) throw new Error(`WordPress config not found: ${sitesConfigPath}`);

  // Load config
  const sitesConfig: WordPressSitesConfig = JSON.parse(readFileSync(sitesConfigPath, 'utf-8'));
  const site = sitesConfig.sites[sitesConfig.active_site];
  if (!site) throw new Error(`Active site not found: ${sitesConfig.active_site}`);

  // Load metadata
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

  // Find all images to upload
  const imageFiles = readdirSync(imagesDir)
    .filter(f => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(extname(f).toLowerCase()))
    .filter(f => !f.includes('-burnt-orange')) // skip variants
    .sort();

  console.log(`\n📸 Uploading ${imageFiles.length} images to WordPress (${site.url})\n`);

  const uploadResults: MediaUploadResult[] = [];

  for (const filename of imageFiles) {
    const localPath = join(imagesDir, filename);
    process.stdout.write(`  Uploading ${filename}... `);

    try {
      const result = await uploadImageToWordPress(site, localPath, filename);
      uploadResults.push(result);
      console.log(`✓ ID: ${result.id}`);
      console.log(`    URL: ${result.source_url}`);
    } catch (err) {
      console.log(`✗ FAILED`);
      console.error(`    Error: ${err instanceof Error ? err.message : err}`);
    }
  }

  // Build media_ids map
  const mediaIds: Record<string, any> = {};
  let featuredId: number | null = null;

  for (const result of uploadResults) {
    const name = basename(result.filename, extname(result.filename));

    if (name === 'featured') {
      featuredId = result.id;
      mediaIds['featured'] = result.id;
      mediaIds['featured_url'] = result.source_url;
    } else {
      // inline-01-journey-map → inline_01
      const match = name.match(/^inline-(\d+)/);
      if (match) {
        const key = `inline_${match[1]}`;
        mediaIds[key] = result.id;
        mediaIds[`${key}_url`] = result.source_url;
      }
    }
  }

  // Update metadata.json
  if (!metadata.wordpress) metadata.wordpress = {};
  metadata.wordpress.media_ids = mediaIds;
  if (featuredId) metadata.wordpress.featured_media_id = featuredId;
  metadata.updated_at = new Date().toISOString();

  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Upload complete! ${uploadResults.length}/${imageFiles.length} images uploaded.`);
  console.log(`\n📋 Media IDs saved to metadata.json:`);
  console.log(JSON.stringify(mediaIds, null, 2));

  if (featuredId) {
    console.log(`\n🖼️  Set featured_media to: ${featuredId} when creating the WordPress post.`);
  }

  console.log(`\n📝 Next: Use these WordPress URLs in the post content HTML.`);
  console.log(`   Replace local ./10-images/ paths with the WordPress-hosted URLs above.`);
}

main().catch(err => {
  console.error('Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
