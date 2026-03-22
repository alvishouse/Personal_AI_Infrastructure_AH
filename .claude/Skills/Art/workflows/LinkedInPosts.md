# LinkedIn Post Image Workflow

**Generate scroll-stopping 1:1 images for LinkedIn posts using the Opening Wound framework.**

Standalone workflow — does NOT require Steps 1-13 of the content creation pipeline. Give it a post, it produces an image.

---

## The Two-Agent Pipeline

```
POST TEXT INPUT
      ↓
[Agent 1: Wound Analyst]
  Reads post → finds opening wound → writes candidate prompt
      ↓
[Agent 2: Prompt Validator]
  Evaluates prompt against Three Pillars + Anti-Patterns
  PASS → proceed to generation
  FAIL → return to Agent 1 with specific critique
      ↓  (max 2 revision cycles)
[Image Generation]
  Runs generate-ulart-image.ts with approved prompt
      ↓
[Output]
  1:1 square PNG ready for LinkedIn
```

**Why two agents?** Image generation costs time and money. The validator is a gate — it catches bad prompts before they become bad images.

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| Post text | Required | Full text of the LinkedIn post |
| Output path | Required | Where to save the generated PNG |
| Post type | Optional | Authority / Framework / Story / Myth-Buster / Quick Win / Case Study / Contrarian |
| Workflow dir | Optional | If running inside content workflow, path to workflow directory |

---

## Step 1: Launch Wound Analyst Agent

Launch a general-purpose agent with the Wound Analyst instructions.

**Agent instructions:** `${PAI_DIR}/.claude/Skills/Art/agents/LinkedInImageGenerator.md`

**Pass to agent:**
```
Read the following LinkedIn post and produce a candidate image prompt.
Follow ALL instructions in your agent guide.

POST TEXT:
---
[full post text here]
---

POST TYPE (if known): [type or "unknown"]
```

**Agent returns:**
- Opening wound identification (quoted line + why it hits)
- Emotional core category
- Candidate prompt
- Anti-pattern self-check

---

## Step 2: Launch Prompt Validator Agent

Do NOT generate the image yet. First validate.

Launch a second general-purpose agent with the Validator instructions.

**Agent instructions:** `${PAI_DIR}/.claude/Skills/Art/agents/LinkedInImagePromptValidator.md`

**Pass to agent:**
```
Evaluate this candidate prompt before image generation.
Follow ALL instructions in your validator guide.

ORIGINAL POST TEXT:
---
[full post text]
---

CANDIDATE PROMPT FROM ANALYST:
---
[candidate prompt from Step 1]
---

ANALYST'S WOUND IDENTIFICATION:
---
[wound analysis from Step 1]
---
```

**Agent returns:** PASS or FAIL with scoring and specific critique.

---

## Step 3: Handle Validator Response

### If PASS ✅

Proceed directly to Step 4 (generation) with the approved prompt.

### If FAIL ❌

**Revision cycle (max 2 attempts):**

1. Send the validator's specific failures back to the Wound Analyst agent
2. Ask analyst to revise the prompt addressing only the flagged issues
3. Re-run the validator on the revised prompt
4. If second attempt also fails — stop and report to user with both prompts and failure reasons

**Do NOT silently proceed with a failed prompt.** The validator is a hard gate.

---

## Step 4: Generate the Image

Once prompt is approved, run generation:

```bash
bun run ${PAI_DIR}/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[APPROVED PROMPT FROM VALIDATOR]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output "[OUTPUT_PATH]"
```

**Size note:** nano-banana-pro uses `--size 2K --aspect-ratio 1:1` (NOT `--size 1:1`). This produces ~2048×2048px.

---

## Step 5: Post-Generation Review

Open the image and verify against the wound-first checklist:

- [ ] **Opening Wound shown:** Image depicts the Before-state pain — NOT the solution or resolution
- [ ] **Human/expressive subject:** Visible human or animal with clear facial expression and body language
- [ ] **Emotional gut-check:** Makes viewer feel "I know exactly how that feels" before reading the post
- [ ] **Gritty medium:** Looks textured, hand-drawn, or sketch-like — NOT clean digital or dark-neon
- [ ] **Scroll-stop contrast:** Visually distinct from polished corporate LinkedIn content
- [ ] **Curiosity gap:** Creates intrigue that requires reading the post to understand
- [ ] **Post-specific:** Could NOT apply to a different post without modification

**Regenerate if:** Abstract geometry, data visualization, resolution shown, no human subject, clean/sterile look, or generic corporate feel.

---

## Batch Mode (Multiple Posts)

To generate images for multiple posts in parallel:

1. Launch all Wound Analyst agents simultaneously (one per post)
2. Wait for all analysts to return candidate prompts
3. Launch all Validator agents simultaneously (one per candidate prompt)
4. Process results: generate approved, revise failed
5. Run generations for all approved prompts

**Parallel launch example:**
```
Launch 4 Wound Analyst agents in parallel, each with:
- Agent 1: Post 01 text + "Authority" type
- Agent 2: Post 02 text + "Framework" type
- Agent 3: Post 03 text + "Story" type
- Agent 4: Post 07 text + "Case Study" type
```

---

## Invocation Examples

### Single post from text
```
Generate a LinkedIn image for this post:
[paste post text]
Save to: /path/to/output.png
```

### Single post from file
```
Generate a LinkedIn image for the post at:
/path/to/post.md
Save image to: /path/to/images/post-01.png
```

### Batch from workflow directory
```
Generate LinkedIn images for the content workflow at:
/path/to/workflow-dir
Posts: 13-extracted-content/linkedin/posts/
Images: 13-extracted-content/linkedin/images/
Posts to generate: post-01, post-02, post-03, post-07
```

### All 8 posts
```
Generate all 8 LinkedIn images for the workflow at:
/path/to/workflow-dir
Use posts from: 13-extracted-content/linkedin/posts/
Save images to: 13-extracted-content/linkedin/images/
```

---

## Output Naming Convention

```
post-01-[type].png      → post-01-authority.png
post-02-[type].png      → post-02-framework.png
post-03-[type].png      → post-03-story.png
post-04-[type].png      → post-04-myth-buster.png
post-05-[type].png      → post-05-quick-win-1.png
post-06-[type].png      → post-06-quick-win-2.png
post-07-[type].png      → post-07-case-study.png
post-08-[type].png      → post-08-contrarian.png
```

---

## The Opening Wound Framework (Reference)

Every prompt produced by this workflow must embody these principles:

### Three Pillars

**1. Emotion — The Visceral Wound**
Show the exact pain from the opening of the post. Highly expressive human/animal/anthropomorphic subject. Body language + facial expressions + physical strain. Evoke: "I know exactly how that feels."

**2. Scroll-Stopping — Visual Disruption**
Visually disrupt the sterile corporate feed. Use: vintage pencil sketches, ink wash, graphite, technical drawing aesthetics on textured or sepia paper. Gritty, tactile, human.

**3. Curiosity — The Intellectual Gap**
Create a puzzle between image and post. Blend deeply human with unexpectedly technical. Never give away the punchline. Force the viewer to read the post.

### Anti-Patterns (Never)
- Metaphor-first abstract geometry
- Data visualizations of statistics
- Showing the resolution / turning point / "multiple paths"
- Faceless silhouettes, glowing nodes, dark-neon aesthetic
- "Clean minimal professional atmosphere"

---

## Agent Files

| Agent | File | Purpose |
|-------|------|---------|
| Wound Analyst | `agents/LinkedInImageGenerator.md` | Reads post → finds wound → writes candidate prompt |
| Prompt Validator | `agents/LinkedInImagePromptValidator.md` | Evaluates prompt → PASS or FAIL with critique |
