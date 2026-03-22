#!/usr/bin/env bun

/**
 * Push newsletter to Notion
 * Workflow: 2026-01-31-playing-it-safe-illusion
 * Issue: #1
 */

import { ContentWorkflowNotionSync } from "/home/alvis/.claude/Skills/ContentWorkflow/tools/notion-sync.ts";
import { readFileSync } from "fs";
import { join } from "path";

const WORKFLOW_DIR = "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion";

async function main() {
  console.log("📬 Pushing Newsletter Issue #1 to Notion...\n");

  // Initialize Notion sync
  const sync = new ContentWorkflowNotionSync();

  // Load metadata
  const metadataPath = join(WORKFLOW_DIR, "metadata.json");
  const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));

  console.log(`Workflow ID: ${metadata.workflow_id}`);
  console.log(`Topic: ${metadata.topic}\n`);

  // Check if workflow exists in Notion
  let workflowNotionId = await sync.workflowExists(metadata.workflow_id);

  if (!workflowNotionId) {
    console.log("📝 Creating workflow entry in Notion...");

    workflowNotionId = await sync.createWorkflow({
      workflow_id: metadata.workflow_id,
      topic: metadata.topic,
      big_idea: metadata.big_idea,
      magic_mechanism: metadata.magic_mechanism,
      status: "Complete",
      current_step: "Step 14: Newsletter Complete",
      wordpress_url: metadata.checkpoints["step-12"]?.wordpress_url,
      wordpress_post_id: metadata.checkpoints["step-12"]?.wordpress_post_id,
      local_directory: WORKFLOW_DIR
    });

    console.log(`✅ Workflow created: ${workflowNotionId}\n`);
  } else {
    console.log(`✅ Workflow exists: ${workflowNotionId}\n`);
  }

  // Create newsletter content entry
  console.log("📧 Creating newsletter entry in Notion...");

  const newsletterPath = join(WORKFLOW_DIR, "14-newsletter/newsletter-final.md");
  const step14 = metadata.checkpoints["step-14"];

  const { id, url } = await sync.createContent({
    content_name: `Newsletter Issue #${step14.issue_number}: The Learning Curve You Can't Buy Back`,
    content_type: "Newsletter",
    platform: "Email",
    word_count: step14.word_count,
    estimated_read_time: 7, // ~1847 words ÷ 250 wpm = ~7.4 min
    local_file_path: newsletterPath,
    status: "Scheduled",
    workflow_notion_id: workflowNotionId,
    strategic_notes: `
Newsletter validated at ${step14.validation_score} (95.3%).
Forward Test: ${step14.forward_test_score}/5 (board-ready).
Subject: "${step14.selected_subject}"
LinkedIn references: ${step14.linkedin_references}

Sections: TL;DR, Myth vs Reality, Quick Win, Metric That Matters, Case Study, Forward CTA
Insight atoms used: ${step14.insight_atoms_extracted}

Distribution: Email (Mailchimp/Substack)
Scheduled: Tuesday 07:00 AM
    `.trim(),
    publish_date: step14.issue_date
  });

  console.log(`✅ Newsletter created in Notion: ${id}`);
  console.log(`🔗 Notion URL: ${url}\n`);

  // Update workflow status
  console.log("🔄 Updating workflow status...");
  await sync.updateWorkflowStatus(workflowNotionId, "Step 14: Newsletter Complete", "Complete");
  console.log("✅ Workflow status updated\n");

  console.log("🎉 Newsletter successfully pushed to Notion!");
  console.log(`\nNext steps:`);
  console.log(`1. Open Notion to review: ${url}`);
  console.log(`2. Schedule distribution via email platform`);
  console.log(`3. Post LinkedIn teaser with newsletter link`);
}

main().catch(error => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
