# Content Pipeline Architecture

## Executive Summary

This document defines a complete content pipeline integrating:
- **GitHub** - Truth repo: system definitions, schemas, scripts, knowledge base
- **PAI** (.claude/) - AI execution engine
- **Notion** - Ideation, review, scheduling, Second Brain (Calendar + Kanban)
- **Directus** - Canonical storage for approved content (API-ready)
- **WordPress** - Publishing delivery layer
- **LinkedIn** - Distribution channel

**Core Principle:** Each system has ONE job. GitHub versions the system itself. Notion owns the human workflow. Directus holds approved content. Delivery channels are push-only.

---

## Revised System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              REVISED PIPELINE                               │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                                                                     │  │
│   │                         NOTION                                      │  │
│   │              (Ideation + Review + Scheduling)                       │  │
│   │                                                                     │  │
│   │   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐ │  │
│   │   │  IDEATE   │───►│    AI     │───►│  REVIEW   │───►│ SCHEDULE │ │  │
│   │   │           │    │  PROCESS  │    │  REFINE   │    │ APPROVE  │ │  │
│   │   │  Kanban   │    │           │    │           │    │          │ │  │
│   │   │  Ideas    │    │  (PAI)    │    │  Kanban   │    │ Calendar │ │  │
│   │   └───────────┘    └───────────┘    └───────────┘    └────┬─────┘ │  │
│   │                          │                                 │       │  │
│   │                          │ Generated                       │       │  │
│   │                          │ content                   Approved      │  │
│   │                          │ returns                   content       │  │
│   │                          ▼                                 │       │  │
│   │                    ┌───────────┐                           │       │  │
│   │                    │   PAI     │                           │       │  │
│   │                    │ (Claude)  │                           │       │  │
│   │                    └───────────┘                           │       │  │
│   │                                                            │       │  │
│   └────────────────────────────────────────────────────────────┼───────┘  │
│                                                                │          │
│                                                                ▼          │
│   ┌─────────────────────────────────────────────────────────────────────┐ │
│   │                         DIRECTUS                                    │ │
│   │                (Canonical Storage - Approved Only)                  │ │
│   │                                                                     │ │
│   │   • Receives approved content from Notion                          │ │
│   │   • Stores canonical version (versioned, API-ready)                │ │
│   │   • NO review workflow here - just storage                         │ │
│   │   • Stable IDs for WordPress/LinkedIn references                   │ │
│   │                                                                     │ │
│   └────────────────────────────────┬────────────────────────────────────┘ │
│                                    │                                      │
│                    ┌───────────────┴───────────────┐                     │
│                    │                               │                     │
│                    ▼                               ▼                     │
│             ┌─────────────┐                 ┌─────────────┐              │
│             │  WORDPRESS  │                 │  LINKEDIN   │              │
│             │  (Deliver)  │                 │ (Distribute)│              │
│             └─────────────┘                 └─────────────┘              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities (Updated)

| Component | Role | Responsibility | NOT Responsible For |
|-----------|------|----------------|---------------------|
| **GitHub** | Truth Repo | System definitions, schemas, scripts, knowledge base, version control | Content storage, runtime execution |
| **Notion** | Human Workflow | Ideation, AI brief, review, refinement, scheduling (Calendar/Kanban) | Publishing, canonical storage |
| **PAI** | Execution | Scraping, AI generation, image creation | Storage, review, approval |
| **Directus** | Canonical Storage | Approved content storage, versioning, API access | Review workflow, scheduling |
| **WordPress** | Delivery | Blog rendering, SEO, public access | Content editing |
| **LinkedIn** | Distribution | Social reach | Long-form content |

---

## GitHub as Foundation Layer

GitHub serves as the **versioned truth repository** for the entire system's structure and knowledge. While content flows through Notion → PAI → Directus → delivery channels, GitHub defines *how* that flow works.

```
════════════════════════════════════════════════════════════════════════════════════
                         GITHUB: THE FOUNDATION LAYER
════════════════════════════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                 │
  │                              CONTENT FLOW                                       │
  │            (what moves through the pipeline - ephemeral)                        │
  │                                                                                 │
  │     NOTION ────► PAI ────► NOTION ────► DIRECTUS ────► WP/LINKEDIN             │
  │     (ideas)    (generate)  (review)    (store)        (deliver)                │
  │                                                                                 │
  └───────────────────────────────────┬─────────────────────────────────────────────┘
                                      │
                                      │  Defined by / Versioned in
                                      │
  ┌───────────────────────────────────▼─────────────────────────────────────────────┐
  │                                                                                 │
  │                               GITHUB                                            │
  │                 (system definitions - permanent)                                │
  │                                                                                 │
  │   ┌─────────────────────────────────────────────────────────────────────────┐  │
  │   │                                                                         │  │
  │   │   📁 PAI SYSTEM (.claude/)                                              │  │
  │   │   ├── Skills/ContentFactory/      ← Workflow definitions               │  │
  │   │   ├── Agents/                     ← AI agent configs                   │  │
  │   │   ├── context/                    ← Knowledge files (UFC)              │  │
  │   │   └── settings/                   ← MCP servers, hooks                 │  │
  │   │                                                                         │  │
  │   │   📁 SCHEMAS & MIGRATIONS                                               │  │
  │   │   ├── directus/                                                        │  │
  │   │   │   ├── schema.yaml             ← Collection definitions             │  │
  │   │   │   └── migrations/             ← Field changes over time            │  │
  │   │   └── wordpress/                                                       │  │
  │   │       └── custom-fields.json      ← ACF/CPT definitions                │  │
  │   │                                                                         │  │
  │   │   📁 ETL & SYNC SCRIPTS                                                 │  │
  │   │   ├── scripts/                                                         │  │
  │   │   │   ├── notion-to-directus.ts   ← Approved content export            │  │
  │   │   │   ├── directus-to-wp.ts       ← Publish automation                 │  │
  │   │   │   └── sync-schemas.ts         ← Apply schema changes               │  │
  │   │   └── .github/workflows/          ← CI/CD pipelines                    │  │
  │   │                                                                         │  │
  │   │   📁 KNOWLEDGE BASE                                                     │  │
  │   │   ├── Docs/                       ← Architecture, SOPs, playbooks      │  │
  │   │   ├── templates/                                                       │  │
  │   │   │   ├── blog-post.md            ← Content templates                  │  │
  │   │   │   └── linkedin-post.md                                             │  │
  │   │   └── prompts/                                                         │  │
  │   │       ├── content-generation.yaml ← Prompt catalog                     │  │
  │   │       └── image-prompts.yaml                                           │  │
  │   │                                                                         │  │
  │   └─────────────────────────────────────────────────────────────────────────┘  │
  │                                                                                 │
  └─────────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════════
```

### What GitHub Stores

| Category | Contents | Purpose |
|----------|----------|---------|
| **PAI System** | `.claude/Skills/`, `.claude/Agents/`, `.claude/context/` | AI workflow definitions, agent configs, knowledge base |
| **Schemas** | `directus/schema.yaml`, `wordpress/custom-fields.json` | Collection/field definitions for Directus + WP |
| **Migrations** | `directus/migrations/`, version history | Track schema changes over time |
| **ETL Scripts** | `scripts/notion-to-directus.ts`, sync jobs | Automation for moving content between systems |
| **CI/CD** | `.github/workflows/` | Deploy schema changes, run sync jobs |
| **Templates** | `templates/blog-post.md`, `templates/linkedin-post.md` | Reusable content structures |
| **Prompts** | `prompts/content-generation.yaml` | Versioned prompt catalog for AI |
| **Docs** | `Docs/ARCHITECTURE.md`, SOPs, playbooks | System documentation |

### GitHub's Role in the Pipeline

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│   SYSTEM DEFINITION (GitHub)          SYSTEM EXECUTION (Runtime)              │
│   ─────────────────────────           ──────────────────────────              │
│                                                                                │
│   ┌────────────────────┐              ┌────────────────────────────────────┐  │
│   │                    │              │                                    │  │
│   │  PAI Skills &      │   deploys    │  PAI (Claude Code)                 │  │
│   │  Agent Configs     │ ──────────►  │  • Runs skills                     │  │
│   │  (.claude/)        │              │  • Executes workflows              │  │
│   │                    │              │                                    │  │
│   └────────────────────┘              └────────────────────────────────────┘  │
│                                                                                │
│   ┌────────────────────┐              ┌────────────────────────────────────┐  │
│   │                    │              │                                    │  │
│   │  Directus Schema   │   applies    │  Directus Instance                 │  │
│   │  (schema.yaml)     │ ──────────►  │  • Collections created             │  │
│   │                    │              │  • Fields configured               │  │
│   │                    │              │                                    │  │
│   └────────────────────┘              └────────────────────────────────────┘  │
│                                                                                │
│   ┌────────────────────┐              ┌────────────────────────────────────┐  │
│   │                    │              │                                    │  │
│   │  ETL Scripts       │  runs via    │  Sync Jobs                         │  │
│   │  (scripts/)        │ ──────────►  │  • Notion → Directus               │  │
│   │                    │  CI/CD       │  • Directus → WordPress            │  │
│   │                    │              │                                    │  │
│   └────────────────────┘              └────────────────────────────────────┘  │
│                                                                                │
│   ┌────────────────────┐              ┌────────────────────────────────────┐  │
│   │                    │              │                                    │  │
│   │  Prompt Catalog    │  referenced  │  AI Content Generation             │  │
│   │  (prompts/)        │ ──────────►  │  • Consistent tone                 │  │
│   │                    │  by PAI      │  • Versioned instructions          │  │
│   │                    │              │                                    │  │
│   └────────────────────┘              └────────────────────────────────────┘  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Proposed Repository Structure

```
Personal_AI_Infrastructure_AH/
├── .claude/                          # PAI system (existing)
│   ├── Skills/
│   │   └── ContentFactory/           # Content pipeline skill
│   ├── Agents/
│   ├── context/                      # UFC knowledge base
│   └── settings.json
│
├── Docs/                             # Documentation (existing)
│   ├── ARCHITECTURE.md
│   ├── CONTENT_PIPELINE_ARCHITECTURE.md
│   └── SECOND_BRAIN_INTEGRATION.md
│
├── schemas/                          # NEW: System schemas
│   ├── directus/
│   │   ├── schema.yaml               # Directus collection definitions
│   │   └── migrations/
│   │       └── 001_initial.yaml
│   └── wordpress/
│       └── custom-fields.json        # ACF field definitions
│
├── scripts/                          # NEW: ETL & automation
│   ├── notion-to-directus.ts
│   ├── directus-to-wordpress.ts
│   ├── sync-directus-schema.ts
│   └── package.json
│
├── templates/                        # NEW: Content templates
│   ├── blog-post.md
│   ├── linkedin-post.md
│   └── newsletter.md
│
├── prompts/                          # NEW: Versioned prompts
│   ├── content-generation.yaml
│   ├── image-prompts.yaml
│   └── linkedin-hooks.yaml
│
└── .github/                          # NEW: CI/CD
    └── workflows/
        ├── sync-schema.yml           # Apply Directus schema changes
        └── deploy-scripts.yml        # Deploy ETL jobs
```

### Key Principle: Separation of Concerns

| Layer | Location | Versioned? | Contains |
|-------|----------|------------|----------|
| **System Definition** | GitHub | ✅ Yes | How the pipeline works |
| **Human Workflow** | Notion | ❌ No | Ideas, reviews, schedules (ephemeral) |
| **Content Storage** | Directus | ❌ No | Approved content (runtime data) |
| **Delivery** | WordPress/LinkedIn | ❌ No | Published content (output) |

**GitHub never stores content itself** — it stores the *rules, schemas, and scripts* that define how content flows through the system.

---

## End-to-End Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│                              CONTENT PIPELINE FLOW                                      │
│                                                                                         │
│   PHASE 1: IDEATION (Human in Notion)                                                  │
│   ═══════════════════════════════════                                                   │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│   │                              NOTION - KANBAN VIEW                                │  │
│   │                                                                                  │  │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │  │
│   │   │   BACKLOG   │  │   READY     │  │    IN AI    │  │   REVIEW    │   ...     │  │
│   │   │             │  │   FOR AI    │  │             │  │             │           │  │
│   │   │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │           │  │
│   │   │ │ AI Post │ │  │ │Security │ │  │ │PAI Guide│ │  │ │Claude   │ │           │  │
│   │   │ └─────────┘ │  │ │Basics   │ │  │ └─────────┘ │  │ │Tutorial │ │           │  │
│   │   │ ┌─────────┐ │  │ └─────────┘ │  │             │  │ └─────────┘ │           │  │
│   │   │ │ Blog    │ │  │             │  │             │  │             │           │  │
│   │   │ │ Ideas   │ │  │             │  │             │  │             │           │  │
│   │   │ └─────────┘ │  │             │  │             │  │             │           │  │
│   │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘           │  │
│   │                                                                                  │  │
│   │   Content Card Properties:                                                      │  │
│   │   • Title, Sources, AI Brief, Targets (Blog/LinkedIn)                          │  │
│   │   • Status: Backlog → Ready for AI → In AI → Review → Scheduled → Approved    │  │
│   │                                                                                  │  │
│   └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                              │
│                                         │ When Status = "Ready for AI"                │
│                                         │ PAI pulls via Notion MCP                    │
│                                         ▼                                              │
│   PHASE 2: AI CONTENT FACTORY                                                         │
│   ════════════════════════════                                                         │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│   │                              PAI (Claude Code)                                   │  │
│   │                                                                                  │  │
│   │   ContentFactory Skill:                                                         │  │
│   │   ┌────────────────────────────────────────────────────────────────────────┐   │  │
│   │   │                                                                         │   │  │
│   │   │   1. FETCH: Notion MCP → Get "Ready for AI" cards                      │   │  │
│   │   │      └── Title, sources, AI brief, targets                             │   │  │
│   │   │                                                                         │   │  │
│   │   │   2. SCRAPE: BrightData/WebFetch → Extract source content              │   │  │
│   │   │                                                                         │   │  │
│   │   │   3. GENERATE:                                                          │   │  │
│   │   │      ├── blog_draft.md (long-form)                                     │   │  │
│   │   │      ├── linkedin_draft.md (short-form)                                │   │  │
│   │   │      └── image_prompts.md                                               │   │  │
│   │   │                                                                         │   │  │
│   │   │   4. IMAGES: Art Skill → Generate visuals                              │   │  │
│   │   │                                                                         │   │  │
│   │   │   5. RETURN TO NOTION: Push drafts back to Notion card                 │   │  │
│   │   │      └── Attach files, update content blocks, set Status = "Review"    │   │  │
│   │   │                                                                         │   │  │
│   │   └────────────────────────────────────────────────────────────────────────┘   │  │
│   │                                                                                  │  │
│   └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                              │
│                                         │ Content returns to Notion                   │
│                                         │ Status updated to "Review"                  │
│                                         ▼                                              │
│   PHASE 3: HUMAN REVIEW & REFINEMENT (Notion)                                         │
│   ═══════════════════════════════════════════                                          │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│   │                              NOTION - REVIEW WORKFLOW                            │  │
│   │                                                                                  │  │
│   │   Human Reviews in Notion:                                                      │  │
│   │   ┌────────────────────────────────────────────────────────────────────────┐   │  │
│   │   │                                                                         │   │  │
│   │   │   📄 Content Card (expanded)                                            │   │  │
│   │   │   ├── Blog Draft (editable in Notion)                                  │   │  │
│   │   │   ├── LinkedIn Draft (editable in Notion)                              │   │  │
│   │   │   ├── Generated Images (preview)                                        │   │  │
│   │   │   └── AI Brief (reference)                                              │   │  │
│   │   │                                                                         │   │  │
│   │   │   Actions:                                                              │   │  │
│   │   │   • Edit content directly in Notion                                    │   │  │
│   │   │   • Request AI revision (move back to "Ready for AI" with notes)       │   │  │
│   │   │   • Approve and schedule (move to Calendar)                            │   │  │
│   │   │                                                                         │   │  │
│   │   └────────────────────────────────────────────────────────────────────────┘   │  │
│   │                                                                                  │  │
│   │   Kanban Flow:                                                                  │  │
│   │   Review ──► Needs Revision ──► Ready for AI (loop)                            │  │
│   │      │                                                                          │  │
│   │      └────► Approved ──► Scheduled (Calendar)                                  │  │
│   │                                                                                  │  │
│   └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                              │
│   PHASE 4: SCHEDULING (Notion Calendar)                                               │
│   ═════════════════════════════════════                                                │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│   │                              NOTION - CALENDAR VIEW                              │  │
│   │                                                                                  │  │
│   │   ┌─────────────────────────────────────────────────────────────────────────┐  │  │
│   │   │  January 2025                                                            │  │  │
│   │   │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐                           │  │  │
│   │   │  │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │                           │  │  │
│   │   │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                           │  │  │
│   │   │  │     │  14 │  15 │  16 │  17 │     │     │                           │  │  │
│   │   │  │     │     │ PAI │     │ AI  │     │     │                           │  │  │
│   │   │  │     │     │Guide│     │Agents    │     │                           │  │  │
│   │   │  │     │     │ 📝  │     │ 📝  │     │     │                           │  │  │
│   │   │  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘                           │  │  │
│   │   │                                                                          │  │  │
│   │   │  Publish Date property triggers handoff to Directus                     │  │  │
│   │   │                                                                          │  │  │
│   │   └─────────────────────────────────────────────────────────────────────────┘  │  │
│   │                                                                                  │  │
│   │   When Status = "Approved" AND Publish Date is set:                            │  │
│   │   → Trigger export to Directus                                                 │  │
│   │                                                                                  │  │
│   └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                              │
│                                         │ Approved content pushed to Directus         │
│                                         │ (via PAI or automation)                      │
│                                         ▼                                              │
│   PHASE 5: CANONICAL STORAGE (Directus)                                               │
│   ═════════════════════════════════════                                                │
│                                                                                         │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│   │                              DIRECTUS                                            │  │
│   │                     (Approved Content Storage Only)                              │  │
│   │                                                                                  │  │
│   │   Purpose:                                                                       │  │
│   │   • Store final, approved content (NOT for review)                             │  │
│   │   • Provide stable IDs and API access                                          │  │
│   │   • Version history for published content                                       │  │
│   │   • Single source for WordPress + LinkedIn                                      │  │
│   │                                                                                  │  │
│   │   Content Collection:                                                           │  │
│   │   ┌──────────────────────────────────────────────────────────────────────────┐ │  │
│   │   │ id          │ title       │ status    │ publish_date │ notion_id        │ │  │
│   │   ├─────────────┼─────────────┼───────────┼──────────────┼──────────────────┤ │  │
│   │   │ uuid-001    │ PAI Guide   │ ready     │ 2025-01-15   │ notion-abc       │ │  │
│   │   │ uuid-002    │ AI Agents   │ ready     │ 2025-01-17   │ notion-def       │ │  │
│   │   │ uuid-003    │ Security    │ published │ 2025-01-10   │ notion-ghi       │ │  │
│   │   └──────────────────────────────────────────────────────────────────────────┘ │  │
│   │                                                                                  │  │
│   │   Statuses (simplified):                                                        │  │
│   │   • ready - Approved in Notion, awaiting publish                               │  │
│   │   • published - Live on WordPress                                               │  │
│   │                                                                                  │  │
│   └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                              │
│                                         │ On publish_date or manual trigger           │
│                    ┌────────────────────┴────────────────────┐                        │
│                    │                                         │                        │
│                    ▼                                         ▼                        │
│   PHASE 6: PUBLISH                              PHASE 7: DISTRIBUTE                   │
│   ════════════════                              ═══════════════════                    │
│                                                                                         │
│   ┌───────────────────────────────┐    ┌───────────────────────────────┐              │
│   │         WORDPRESS             │    │          LINKEDIN             │              │
│   │      (Delivery Only)          │    │        (Distribution)         │              │
│   │                               │    │                               │              │
│   │   Push-only model:            │    │   From Directus:              │              │
│   │   ├── WP REST API             │    │   ├── linkedin_content        │              │
│   │   ├── Create/update post      │    │   ├── social_image            │              │
│   │   └── Upload media            │    │   └── Auto or manual post     │              │
│   │                               │    │                               │              │
│   │   ❌ No editing in WP         │    │                               │              │
│   │   ✓ Push-only, read-only     │    │                               │              │
│   │                               │    │                               │              │
│   └───────────────────────────────┘    └───────────────────────────────┘              │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Phases Diagram

```
════════════════════════════════════════════════════════════════════════════════════
                              7-PHASE CONTENT PIPELINE
════════════════════════════════════════════════════════════════════════════════════


  PHASE 1                    PHASE 2                    PHASE 3
  IDEATION                   AI FACTORY                 REVIEW & REFINE
  ─────────                  ──────────                 ───────────────

  ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
  │             │           │             │           │             │
  │   NOTION    │           │    PAI      │           │   NOTION    │
  │   KANBAN    │  ───────► │   CLAUDE    │  ───────► │   KANBAN    │
  │             │           │             │           │             │
  │  ┌───────┐  │  "Ready   │  ┌───────┐  │  Drafts   │  ┌───────┐  │
  │  │ Idea  │  │  for AI"  │  │Content│  │  return   │  │Review │  │
  │  │ Card  │  │           │  │Factory│  │           │  │ Edit  │  │
  │  └───────┘  │           │  │ Skill │  │           │  │Refine │  │
  │             │           │  └───────┘  │           │  └───────┘  │
  └─────────────┘           └─────────────┘           └─────────────┘
                                   │
       Human creates               │                   Human reviews
       ideas + AI brief            │                   + edits content
                                   │
                            ┌──────┴──────┐
                            │   Actions   │
                            ├─────────────┤
                            │ • Scrape    │
                            │ • Generate  │
                            │ • Images    │
                            └─────────────┘



                                    │
                    ┌───────────────┘  (if needs revision, loop back to Phase 2)
                    │
                    ▼

  PHASE 4                    PHASE 5                    PHASES 6 & 7
  SCHEDULE                   CANONICAL STORAGE          PUBLISH + DISTRIBUTE
  ────────                   ─────────────────          ───────────────────

  ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
  │             │           │             │           │ WORDPRESS   │
  │   NOTION    │           │  DIRECTUS   │           │ (Deliver)   │
  │  CALENDAR   │  ───────► │   (API)     │  ───────► ├─────────────┤
  │             │  Approved │             │           │ • Blog post │
  │  ┌───────┐  │           │  ┌───────┐  │  On       │ • SEO       │
  │  │Jan 15│  │           │  │content│  │  publish  │ • Media     │
  │  │ PAI  │  │           │  │  API  │  │  date     └─────────────┘
  │  │Guide │  │           │  └───────┘  │                  │
  │  └───────┘  │           │             │                  │
  └─────────────┘           └─────────────┘                  │
                                   │                         │
       Human schedules             │                         │
       publish date                │                         ▼
                            Stores canonical          ┌─────────────┐
                            approved content          │  LINKEDIN   │
                                                      │ (Distribute)│
                                                      ├─────────────┤
                                                      │ • Short post│
                                                      │ • Image     │
                                                      │ • Hashtags  │
                                                      └─────────────┘


════════════════════════════════════════════════════════════════════════════════════
                              PHASE SUMMARY
════════════════════════════════════════════════════════════════════════════════════

  ┌────────┬──────────────────┬──────────────┬────────────────────────────────────┐
  │ Phase  │ System           │ Owner        │ Action                             │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   1    │ Notion (Kanban)  │ Human        │ Create idea, sources, AI brief    │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   2    │ PAI (Claude)     │ AI           │ Scrape, generate, create images    │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   3    │ Notion (Kanban)  │ Human        │ Review, edit, refine content       │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   4    │ Notion (Calendar)│ Human        │ Schedule publish date, approve     │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   5    │ Directus         │ PAI/Auto     │ Store approved, versioned content  │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   6    │ WordPress        │ PAI/Auto     │ Publish blog post                  │
  ├────────┼──────────────────┼──────────────┼────────────────────────────────────┤
  │   7    │ LinkedIn         │ PAI/Human    │ Social distribution                │
  └────────┴──────────────────┴──────────────┴────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════════════
                              DATA FLOW ARROWS
════════════════════════════════════════════════════════════════════════════════════

  NOTION ──────────────────────────────────────────────────────────────────────────►
         │                              ▲
         │ MCP: Pull "Ready for AI"     │ MCP: Push drafts back
         ▼                              │
        PAI ────────────────────────────┘
         │
         │ REST API: Export approved content
         ▼
      DIRECTUS ─────────────────────────┬───────────────────────────────────────────
         │                              │
         │ REST API                     │ REST/OAuth API
         ▼                              ▼
      WORDPRESS                     LINKEDIN


════════════════════════════════════════════════════════════════════════════════════
```

---

## Notion Database Schema (Expanded)

### Content Pipeline Database

| Property | Type | Purpose |
|----------|------|---------|
| **Title** | Title | Content topic |
| **Status** | Select | Workflow state (see below) |
| **Sources** | URL (multi) | Reference materials |
| **AI Brief** | Text | Tone, audience, CTA instructions |
| **Targets** | Multi-select | `Blog` / `LinkedIn` / `Newsletter` |
| **Publish Date** | Date | Scheduled publication (Calendar view) |
| **Blog Draft** | Text / Page | AI-generated + human-edited content |
| **LinkedIn Draft** | Text | Short-form version |
| **Feature Image** | Files | Generated/uploaded image |
| **SEO Title** | Text | For WordPress |
| **SEO Description** | Text | Meta description |
| **Directus ID** | Text | Link to canonical record (after approval) |
| **WordPress ID** | Number | Link to published post |
| **Reviewer** | Person | Assigned reviewer |
| **Notes** | Text | Feedback, revision requests |

### Status Flow (Kanban Columns)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           NOTION KANBAN COLUMNS                              │
│                                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐ │
│  │ BACKLOG │ │ READY   │ │  IN AI  │ │ REVIEW  │ │SCHEDULED│ │ PUBLISHED │ │
│  │         │ │ FOR AI  │ │         │ │         │ │         │ │           │ │
│  │         │ │         │ │         │ │         │ │         │ │           │ │
│  │ Ideas   │ │ Queued  │ │ PAI     │ │ Human   │ │ On      │ │ Live on   │ │
│  │ parked  │ │ for     │ │ working │ │ editing │ │ calendar│ │ WordPress │ │
│  │         │ │ AI      │ │         │ │         │ │         │ │           │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └───────────┘ │
│       │          │          │          │          │                        │
│       └──────────┼──────────┼──────────┼──────────┘                        │
│                  │          │          │                                    │
│                  │          │          │  ┌────────────┐                   │
│                  │          │          └──┤   NEEDS    │ (revision loop)   │
│                  │          │             │  REVISION  ├───┐               │
│                  │          │             └────────────┘   │               │
│                  │          │                              │               │
│                  └──────────┴──────────────────────────────┘               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Views in Notion

| View | Type | Purpose |
|------|------|---------|
| **Pipeline** | Kanban | Status-based workflow |
| **Calendar** | Calendar | Publish date scheduling |
| **By Target** | Board | Group by Blog/LinkedIn |
| **My Reviews** | Table | Filter by assigned reviewer |
| **Ready to Publish** | Table | Status = Scheduled, for Directus export |

---

## Updated Separation of Concerns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   NOTION                        PAI                       DIRECTUS          │
│   (Human Workflow)              (Execution)               (Storage)         │
│                                                                             │
│   ┌─────────────────┐          ┌─────────────┐           ┌────────────┐   │
│   │   IDEATE        │          │             │           │            │   │
│   │   + PLAN        │ ───────► │   GENERATE  │           │  STORE     │   │
│   │   (Kanban)      │   MCP    │   SCRAPE    │           │  VERSION   │   │
│   │                 │          │   IMAGES    │           │  SERVE     │   │
│   │   ┌─────────┐   │          │             │           │            │   │
│   │   │         │   │ ◄─────── │             │           │            │   │
│   │   │ REVIEW  │   │ Returns  └─────────────┘           │            │   │
│   │   │ REFINE  │   │ drafts                             │            │   │
│   │   │         │   │                                    │            │   │
│   │   └────┬────┘   │                                    │            │   │
│   │        │        │                                    │            │   │
│   │   ┌────▼────┐   │                                    │            │   │
│   │   │SCHEDULE │   │                                    │            │   │
│   │   │(Calendar)   │ ─────────────────────────────────► │            │   │
│   │   │ APPROVE │   │  When approved                     │            │   │
│   │   └─────────┘   │                                    └─────┬──────┘   │
│   └─────────────────┘                                          │          │
│                                                                │          │
│        Human owns                  AI executes            API serves      │
│        entire workflow             on demand              to channels     │
│                                                                │          │
│                              ┌─────────────────────────────────┤          │
│                              │                                 │          │
│                              ▼                                 ▼          │
│                       ┌─────────────┐                   ┌─────────────┐  │
│                       │  WORDPRESS  │                   │  LINKEDIN   │  │
│                       │  (Deliver)  │                   │ (Distribute)│  │
│                       └─────────────┘                   └─────────────┘  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Directus Schema (Simplified)

Since Notion handles the review workflow, Directus only needs to store approved content:

**`content`** collection:
```
├── id (uuid, primary)
├── status (string: ready/published)        ← Simplified: no draft/review
├── title (string)
├── slug (string, unique)
├── content_md (text)
├── content_html (text)
├── excerpt (text)
├── seo_title (string)
├── seo_description (text)
├── feature_image (file)
├── social_image (file)
├── linkedin_content (text)
├── notion_id (string)                      ← Links back to Notion
├── wordpress_id (integer)
├── categories (m2m)
├── tags (m2m)
├── publish_date (datetime)
├── published_at (datetime)
└── created_at (datetime)
```

**Status values:**
- `ready` - Approved in Notion, awaiting WordPress publish
- `published` - Live on WordPress

---

## PAI Skill: ContentFactory (Updated)

```
.claude/Skills/ContentFactory/
├── SKILL.md
├── workflows/
│   ├── Ingest.md                     # Pull "Ready for AI" from Notion
│   ├── Generate.md                   # Create content + images
│   ├── ReturnToNotion.md             # Push drafts BACK to Notion for review
│   ├── ExportToDirectus.md           # Push "Approved" content to Directus
│   ├── Publish.md                    # Directus → WordPress
│   └── Distribute.md                 # Directus → LinkedIn
└── tools/
    ├── notion-pull.ts
    ├── notion-push.ts                # NEW: Push content back to Notion
    ├── scrape-sources.ts
    ├── generate-content.ts
    ├── directus-client.ts
    ├── wordpress-client.ts
    └── linkedin-client.ts
```

### Updated Workflow Commands

```bash
# Pull items ready for AI processing
/content ingest

# Generate content and return to Notion for review
/content generate

# Export approved items from Notion to Directus
/content export

# Publish from Directus to WordPress
/content publish

# Post to LinkedIn
/content distribute
```

---

## Quick Reference: System Responsibilities

| System | Does | Does NOT |
|--------|------|----------|
| **GitHub** | Version system definitions, schemas, scripts, prompts, templates | Store content, execute runtime |
| **Notion** | Ideas, AI briefs, review, editing, scheduling, approval | Store canonical content, serve API |
| **PAI** | Scrape, generate, images, push to Notion, push to Directus | Review, approve, schedule |
| **Directus** | Store approved content, version, serve API | Review workflow, scheduling |
| **WordPress** | Render blog, SEO, public access | Edit content, store source |
| **LinkedIn** | Social distribution | Long-form content |

---

## Implementation Phases (Updated)

### Phase 0: GitHub Foundation
- [ ] Create `schemas/directus/` directory with `schema.yaml`
- [ ] Create `scripts/` directory for ETL jobs
- [ ] Create `templates/` directory for content templates
- [ ] Create `prompts/` directory for versioned prompt catalog
- [ ] Set up `.github/workflows/` for CI/CD (optional)

### Phase 1: Notion Setup
- [ ] Create Content Pipeline database with all properties
- [ ] Configure Kanban view (statuses as columns)
- [ ] Configure Calendar view (Publish Date)
- [ ] Set up Notion integration + share database
- [ ] Add Notion MCP server to PAI

### Phase 2: PAI ContentFactory
- [ ] Create skill structure in `.claude/Skills/ContentFactory/`
- [ ] Implement Ingest workflow (Notion → PAI)
- [ ] Implement Generate workflow (AI content)
- [ ] Implement ReturnToNotion workflow (PAI → Notion)
- [ ] Reference templates and prompts from GitHub

### Phase 3: Directus + Publishing
- [ ] Set up Directus instance
- [ ] Apply schema from `schemas/directus/schema.yaml`
- [ ] Implement ExportToDirectus workflow (Notion approved → Directus)
- [ ] Implement Publish workflow (Directus → WordPress)
- [ ] Test full pipeline

### Phase 4: Distribution
- [ ] LinkedIn integration (API or manual)
- [ ] Notifications for review assignments
- [ ] Analytics/reporting

---

*This architecture keeps GitHub as the versioned truth for system definitions, Notion as the human workflow hub (ideation → review → scheduling), and Directus as the clean API layer for publishing. PAI executes AI work and shuttles content between systems.*
