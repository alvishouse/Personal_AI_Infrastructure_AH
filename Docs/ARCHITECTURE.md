# PAI Architecture Documentation

## Overview

This document provides a high-level decomposition of the Personal AI Infrastructure (PAI) system, including component definitions, connections, and information flow.

---

## System Philosophy

PAI implements a **"scaffolding-first"** approach where system architecture matters more than any single AI model. The system is designed around these core principles:

1. **Scaffolding > Model** - Architecture determines reliability
2. **Code Before Prompts** - Deterministic code handles computation
3. **Separation of Concerns** - Each component has one job
4. **Automated Capture** - Documentation happens without effort

---

## Complete Repository Structure

```
Personal_AI_Infrastructure_AH/
│
├── .claude/                              # PAI Core System
│   │
│   ├── settings.json                     # Master config: hooks, permissions, env
│   ├── .mcp.json                         # MCP server definitions
│   ├── .env.example                      # API key template
│   ├── setup.sh                          # Bootstrap script
│   ├── statusline-command.sh             # Terminal status display
│   ├── zshrc-aliases                     # Shell convenience aliases
│   │
│   ├── Agents/                           # Specialist Personas
│   │   ├── Engineer.md                   # Principal software engineer
│   │   ├── Architect.md                  # System design specialist
│   │   ├── Researcher.md                 # Multi-source investigator
│   │   ├── Designer.md                   # Visual/UX specialist
│   │   └── Pentester.md                  # Security testing
│   │
│   ├── Commands/                         # Slash Commands (/command)
│   │   └── paiupdate.md                  # System update command
│   │
│   ├── Skills/                           # Modular Expertise Containers
│   │   ├── CORE/                         # Identity & foundation (auto-loads)
│   │   │   ├── SKILL.md                  # Routing & response format
│   │   │   ├── CONSTITUTION.md           # 13 founding principles
│   │   │   ├── SkillSystem.md            # Skill creation rules
│   │   │   ├── HookSystem.md             # Event automation
│   │   │   └── HistorySystem.md          # UOCS documentation
│   │   ├── Research/                     # Multi-source investigation
│   │   ├── Art/                          # Visual content generation
│   │   ├── Fabric/                       # 248+ AI patterns
│   │   ├── BrightData/                   # Four-tier web scraping
│   │   ├── Observability/                # Real-time dashboard
│   │   └── [Additional skills...]
│   │
│   ├── Hooks/                            # Event-Driven Automation
│   │   ├── lib/                          # Shared utilities
│   │   ├── load-core-context.ts          # SessionStart: inject CORE
│   │   ├── capture-all-events.ts         # PostToolUse: JSONL logs
│   │   ├── stop-hook.ts                  # Stop: voice + history
│   │   └── subagent-stop-hook.ts         # SubagentStop: categorize
│   │
│   ├── History/                          # UOCS - Execution Memory
│   │   ├── Sessions/                     # What happened
│   │   ├── Learnings/                    # What we learned
│   │   ├── Research/                     # What we investigated
│   │   ├── Decisions/                    # Why we chose
│   │   ├── Execution/                    # Features/Bugs/Refactors
│   │   └── Raw-Outputs/                  # JSONL event logs
│   │
│   ├── Tools/                            # Utilities & Bootstrap
│   │   └── setup/                        # Installation scripts
│   │
│   ├── voice-server/                     # Text-to-Speech (port 8888)
│   │
│   └── Scratchpad/                       # Temporary working files
│
├── Docs/                                 # Documentation
├── README.md                             # Project overview
├── PAI_CONTRACT.md                       # System guarantees
├── SECURITY.md                           # Security protocols
└── .pai-protected.json                   # Protected files manifest
```

---

## High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLAUDE CODE (Orchestrator)                       │
│                     Interprets requests, routes to components               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
   ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
   │    HOOKS     │           │    SKILLS    │           │    AGENTS    │
   │  (Automation)│           │  (Expertise) │           │ (Specialists)│
   └──────┬───────┘           └──────┬───────┘           └──────┬───────┘
          │                          │                          │
          │                          ▼                          │
          │                  ┌──────────────┐                   │
          │                  │  CORE SKILL  │                   │
          │                  │  (Identity)  │                   │
          │                  └──────────────┘                   │
          │                                                     │
          └─────────────┬───────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
   ┌────────────┐ ┌───────────┐ ┌─────────────┐
   │  HISTORY   │ │   VOICE   │ │ OBSERVABILITY│
   │   (UOCS)   │ │  SERVER   │ │  DASHBOARD   │
   └────────────┘ └───────────┘ └─────────────┘
```

---

## Component Descriptions

### 1. Skills (`.claude/Skills/`)

**Purpose:** Modular containers for domain expertise

**Structure:**
```
SkillName/
├── SKILL.md           # Routing table & examples
├── workflows/         # Procedural execution
└── tools/             # Deterministic code (TypeScript)
```

**Key Rules:**
- TitleCase naming (mandatory)
- "USE WHEN" intent triggers in description
- Code before prompts (deterministic execution)

### 2. Agents (`.claude/Agents/`)

**Purpose:** Specialist personas with distinct capabilities

| Agent | Role | Model |
|-------|------|-------|
| Engineer | Implementation, debugging | Sonnet |
| Architect | System design, decisions | Sonnet |
| Researcher | Investigation, analysis | Sonnet |
| Designer | Visual/UX work | Sonnet |
| Pentester | Security testing | Sonnet |

### 3. Hooks (`.claude/Hooks/`)

**Purpose:** Event-driven automation

| Hook Type | Trigger | Primary Use |
|-----------|---------|-------------|
| SessionStart | Session begins | Load CORE context |
| Stop | Main agent completes | Voice notification, history |
| SubagentStop | Specialist completes | Categorize work |
| PostToolUse | Every tool execution | JSONL event logging |
| SessionEnd | Session exits | Summary generation |

### 4. History/UOCS (`.claude/History/`)

**Purpose:** Universal Output Capture System - automated documentation

| Directory | Content | Trigger |
|-----------|---------|---------|
| Sessions/ | Session summaries | SessionEnd hook |
| Learnings/ | Problem-solving insights | Stop hook |
| Research/ | Investigation reports | Researcher agent |
| Decisions/ | Architecture rationale | Architect agent |
| Execution/ | Features/Bugs/Refactors | Engineer agent |
| Raw-Outputs/ | JSONL event logs | PostToolUse hook |

---

## Information Flow

```
USER REQUEST
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  SESSION START                                      │
│  ├─ load-core-context.ts → Injects CORE/SKILL.md   │
│  └─ capture-all-events.ts → Logs session start     │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  SKILL MATCHING                                     │
│  ├─ Evaluates "USE WHEN" clauses                   │
│  ├─ Routes to matching Workflow                    │
│  └─ May delegate to specialized Agent              │
└─────────────────────────────────────────────────────┘
      │
      ├──────────────────────┐
      ▼                      ▼
┌────────────┐        ┌────────────┐
│  TOOL USE  │        │   AGENT    │
│ (Bash,Read)│        │   TASK     │
└─────┬──────┘        └─────┬──────┘
      │                     │
      ▼                     ▼
┌─────────────────────────────────────────────────────┐
│  POST-TOOL HOOKS                                    │
│  └─ capture-all-events.ts → Appends to JSONL       │
└─────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────┐
│  COMPLETION HOOKS (Stop / SubagentStop)             │
│  ├─ Voice Server → Speaks completion message        │
│  ├─ History → Saves to appropriate directory        │
│  └─ Observability → Updates dashboard               │
└─────────────────────────────────────────────────────┘
```

---

## External Integrations

### MCP Servers (`.mcp.json`)

| Server | Purpose |
|--------|---------|
| BrightData | Anti-bot web scraping |
| Playwright | Browser automation |
| Stripe | Payment operations |
| httpx | Tech stack detection |

### Voice Server (port 8888)

- ElevenLabs TTS integration
- Agent-specific voices
- Completion notifications

### Observability Dashboard (ports 4000/5172)

- Real-time event streaming
- Agent activity visualization
- WebSocket updates

---

## Configuration Files

| File | Purpose |
|------|---------|
| `settings.json` | Claude Code config: hooks, permissions, env |
| `.mcp.json` | MCP server definitions |
| `.env` | API keys (from .env.example) |
| `.pai-protected.json` | Files that must not be modified |

---

## Key Architectural Patterns

### 1. Skills-as-Containers
Each skill is self-contained with routing, workflows, and tools.

### 2. Hook System
Event-driven automation ensures consistent behavior without manual intervention.

### 3. Universal Output Capture (UOCS)
Every action is logged, creating institutional memory automatically.

### 4. Agent Specialization
Different personas for different tasks, each with appropriate capabilities.

---

## Workshop Analogy

Think of PAI like a professional workshop:

- **Tool Chest** (`/Skills/CORE/`) - Essential tools always accessible
- **Project Bays** (`/Skills/*/`) - Specialized areas for specific work
- **Logbook** (`/History/`) - Everything that happens gets recorded
- **Specialists** (`/Agents/`) - Experts for different types of work

The assistant only opens the relevant drawers and bays for each task, ensuring the workspace remains clean and the right tool is always used.

---

*This document is the architectural reference for PAI. For operational details, see the individual system documentation files in `.claude/Skills/CORE/`.*
