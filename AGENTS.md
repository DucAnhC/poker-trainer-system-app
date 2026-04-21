# AGENTS.md

# Purpose

This file is the operating contract for AI coding agents working on `poker-trainer-system`.

The goal is not to make random code changes quickly.
The goal is to understand the project direction, choose the highest-leverage scoped work, implement it cleanly, validate it, and keep the repository aligned with its product vision and specs.

This product is being built as a **playable poker training room**, not just a quiz app and not just a polished UI shell.

The product is not:

- a static chart browser
- a solver clone
- a real-money gambling tool
- a poker forum or content dump
- a generic dashboard
- a giant chatbot poker interface

The product should become:

- a premium dark tactical poker learning surface
- a decision-focused poker training experience
- a system where users face realistic spots, make decisions, get concise coaching, review mistakes, and improve over time

---

## 1. Autonomous execution mode

Operate in **autonomous execution mode** by default.

That means:

- do not ask for routine yes/no confirmation before making normal scoped changes
- do not stop after analysis just to ask whether to continue
- do not ask permission for normal implementation choices, UI fixes, state-flow fixes, docs updates, or tests
- make reasonable decisions independently based on the repo docs, project rules, and current phase

Only pause and ask for clarification if one of these is true:

- a change would be destructive, irreversible, or likely to remove major existing functionality
- multiple major product directions are genuinely possible and the docs do not resolve the ambiguity
- secrets, deployment credentials, billing, external services, or production data could be affected
- the change would significantly alter project scope, architecture, or product philosophy beyond what the current docs support
- the repo docs clearly conflict and no safe interpretation is possible

Otherwise, decide and proceed.

---

## 2. Product mission

Build a training platform that helps learners:

- think in ranges instead of guessing one exact hand
- make decisions with context: position, stack depth, action history, board texture, and player type
- separate decision quality from short-term results
- learn baseline play before layering exploitative adjustments
- review recurring mistakes and improve over time
- develop stronger learning loops through structured repetition, reveal, recap, and progress tracking

The current strategic direction is:

- move away from “quiz app” behavior
- move toward a real poker training product
- preserve the dark tactical premium feel
- make trainer flows more playable, teachable, and replayable

The correct product fantasy is:

- hero / villain
- board / pot / action / decision
- coach overlay
- reveal / takeaway / next drill
- session loop
- training room feel

---

## 3. Mandatory reading order before coding

Before making code changes, read these files in this order:

1. `/README.md`
2. `/PROJECT_SUMMARY.md`
3. `/PRODUCT_VISION.md`
4. `/PROJECT_RULES.md`
5. `/AI_TUTOR_PLAN.md`
6. `/CONTENT_MATRIX.md`
7. `/UI_SYSTEM.md`
8. `/ROADMAP.md`
9. `/TASK.md`
10. `/CHANGELOG.md`
11. `/KNOW_ISSUES.md`
12. `/specs/poker-trainer-system/proposal.md`
13. `/specs/poker-trainer-system/requirements.md`
14. `/specs/poker-trainer-system/design.md`
15. `/specs/poker-trainer-system/tasks.md`
16. relevant handbook files in `/docs/handbook/`
17. relevant docs under `/docs/`
18. then inspect:
   - `/package.json`
   - Prisma schema and config
   - `/src`
   - `/specs`
   - related tests

If a repo already contains approved specs or product context, do not start implementation from assumptions.

If multiple docs overlap, use this conflict resolution order:

1. current approved task/spec constraints
2. current product vision and summary docs
3. project rules
4. older docs or notes

Do not silently ignore conflicts. Resolve them explicitly in your reasoning and implementation summary.

---

## 4. Required work cycle

Unless a hard blocker appears, complete the following in one continuous work cycle.

### Step 1 — Understand the repo
Summarize:

- current architecture
- feature/module structure
- current trainer flow
- current state management approach
- reusable UI systems
- likely weak points
- mismatch between current app behavior and target product direction

### Step 2 — Identify the highest-leverage scoped batch
Decide what to work on next based on:

- current phase
- product priority
- known issues
- implementation cost vs product payoff

State:

- what you will change now
- why this batch is highest leverage
- what you will deliberately not touch in this batch

### Step 3 — Implement immediately
Do not stop to ask permission for routine changes.
Make the scoped batch cleanly and coherently.

### Step 4 — Validate
After changes:

- inspect for regressions
- verify affected trainer flows still work
- verify touched layouts are not broken
- verify states are predictable
- run relevant tests if available
- add or update tests if clearly justified

### Step 5 — Update docs if needed
If behavior, architecture, state flow, feature flow, or known issues changed materially, update the relevant docs in the same change.

### Step 6 — Report clearly
End each work cycle with a structured summary.

---

## 5. Output format for each work cycle

For each work cycle, report in this order:

1. Repo understanding
2. Gaps vs target product
3. Proposed change batch
4. Files inspected
5. Files edited
6. Implementation completed
7. Validation results
8. Docs updated
9. Remaining risks
10. Next best step

Do not stop after analysis unless a true blocker exists.

---

## 6. Priority order for implementation

When deciding what matters most, use this order:

### Priority 1 — Product behavior and state correctness
- fix product behavior bugs
- stabilize trainer state flow
- improve learning flow
- implement proper answer reveal behavior
- remove friction that harms learning

### Priority 2 — Training loop quality
- session flow
- streaks
- confidence input
- mistake tagging / mistake memory
- recap behavior
- replay value

### Priority 3 — Content architecture
- content matrix alignment
- richer spot metadata
- scenario families
- structured curriculum growth
- less randomness in content expansion

### Priority 4 — AI coach system
- silent coach
- session coach
- lightweight nudges
- related spot suggestion
- leak-aware support

### Priority 5 — UI polish
- visual consistency
- layout hierarchy
- reduced fragmentation
- overflow fixes
- stronger scene composition

Do **not** spend major effort on decorative CSS while behavior and learning flow are still weak.

---

## 7. Specs-first and phase-control rule

Always check the current phase in:

- `/specs/poker-trainer-system/tasks.md`
- `/ROADMAP.md`
- `/TASK.md`

Rules:

- if the requested work is in phase, implement it cleanly
- if the requested work crosses into later phases, call out the scope change
- do not bundle future-phase work just because it feels adjacent
- when in doubt, deliver the smallest complete slice that matches the active phase

If a task changes any of the following, update the related spec files first or in the same change:

- product scope
- training modes
- scenario schema
- explanation model
- persistence model
- progress metrics
- architecture boundaries
- AI coach flow
- core trainer state flow

Do not let implementation drift silently away from the docs.

---

## 8. Poker-domain guardrails

All poker logic must respect these rules:

- teach ranges, not exact-hand certainty
- context matters: position, stack depth, board texture, action history, and player type should not be ignored when the spot depends on them
- avoid absolute claims like “always bet here” unless the content is explicitly labeled as a simplification
- distinguish `simplification`, `baseline`, and `exploit`
- do not invent solver-level precision unless the product scope explicitly needs it
- if uncertain about a poker recommendation, choose the more conservative explanation and label the assumption

This project teaches practical decision quality, not fake certainty.

---

## 9. Handling uncertain poker logic

If a spot is strategically sensitive or intentionally simplified:

- state the assumption in the content, docs, or code comments where appropriate
- label whether the answer is a beginner heuristic, baseline recommendation, or exploit
- prefer explanation blocks that say why the action fits the training assumptions
- avoid pretending a contested line is universally correct

When using mock content, keep the guidance practical and internally consistent rather than falsely over-precise.

---

## 10. Learning-flow principles

This project should behave like a trainer, not a shallow quiz.

The correct learning flow is generally:

1. show the spot
2. let the user choose an action
3. lock the selection
4. reveal whether it is correct or not
5. show the recommended line
6. explain why it fits the context
7. show a short takeaway
8. let the user continue, retry, or move into related practice

Avoid patterns like:

- instant auto-next after answer
- explanation that disappears too quickly
- noisy layouts that fight the decision
- giant text dumps
- over-chatty AI that breaks training flow

When in doubt, choose the version that improves learning clarity.

---

## 11. UX principles for trainer screens

Trainer screens should feel educational, decision-focused, and poker-native.

Every trainer screen should make these clear:

- what the scenario is
- what decision is being asked
- what options are available
- what the learner selected
- what the recommended answer is after submission
- why the answer fits the context
- why a tempting wrong answer is weaker
- where the learner is in the session

Do not hide the teaching purpose behind decorative UI.

Do not let support panels overpower the main scene.

Prefer:

- strong scene hierarchy
- fewer, stronger information blocks
- clear decision focus
- readable reveal space
- premium dark tactical feel
- consistency across modules

Avoid:

- many micro-cards
- box-inside-box clutter
- thin vertical info strips
- crowded support panels
- dashboard-like fragmentation

---

## 12. Baseline vs exploit vs simplification

Use these meanings consistently:

- `simplification`: a deliberately reduced teaching rule for beginners or MVP training
- `baseline`: a solid default strategy for common spots under the product’s assumptions
- `exploit`: an adjustment based on opponent tendencies or a specific population read

If the UI or content exposes one of these, the label should be explicit enough that the learner can tell what kind of advice they are seeing.

---

## 13. Mock-data-first rule

Start with mock data and local persistence unless the current phase explicitly requires more.

Rules:

- seed scenarios should live in structured data files
- progress can begin in local storage or mock adapters
- domain models should not depend on a database being present unless the phase requires it
- database work should be introduced after schemas and flows are stable enough
- do not overcouple UI experiments to persistence details

---

## 14. Data and schema rules

When changing or adding scenario/training data, prefer useful structured metadata where appropriate, such as:

- module
- street
- hero position
- villain position
- hero hand
- board
- pot size
- bet to call
- stack depth
- action history
- answer options
- correct answer
- explanation
- principle tags
- difficulty
- villain profile
- math metadata such as outs, equity, or required pot odds

Do not add schema complexity without product payoff.

The point of richer metadata is to support:

- stronger UI scene building
- better explanations
- mistake tracking
- related spot logic
- future adaptive coaching

---

## 15. Modularity rules

Keep the system modular from the start.

- separate domain models from UI components
- separate trainer flow logic from content definitions
- separate explanation rendering from recommendation logic
- separate progress tracking from session presentation
- keep feature-specific files inside the feature that owns them
- keep shared primitives clearly reusable

Do not create large files that mix several responsibilities.

If a file becomes difficult to understand in one screenful, consider splitting it.

---

## 16. State-flow rules

Make trainer states explicit whenever practical.

Prefer clear flow states such as:

- `idle`
- `selected`
- `locked`
- `revealed`
- `ready_next`

If coach or hint layers exist, make them explicit too.
If later table simulation states appear, make those explicit as well.

Avoid vague state coupling where UI behavior becomes hard to predict.

State clarity matters more than cleverness.

---

## 17. Documentation update rule

Whenever you add or change:

- a feature module
- a scenario field
- an explanation block format
- a training mode
- a progress metric
- a major UX flow
- a trainer state flow
- AI coach behavior
- content architecture assumptions

also update the relevant docs:

- `/specs/poker-trainer-system/*.md`
- `/docs/handbook/*.md` when learning content or framing changes
- `/README.md` when repository-level expectations change
- `/CHANGELOG.md`
- `/TASK.md`
- `/ROADMAP.md`
- `/UI_SYSTEM.md`
- `/CONTENT_MATRIX.md`
- `/AI_TUTOR_PLAN.md`
- `/KNOW_ISSUES.md`

Do not rewrite docs unnecessarily.
Update only what actually changed or what became newly clear.

---

## 18. Development workflow rules

- read the relevant docs before touching code
- confirm the work belongs in the current phase
- reuse existing types, naming, and patterns where reasonable
- keep code readable and reviewable
- add or update mock content when new trainer behavior needs it
- manually test affected flows
- summarize assumptions, scope, and tradeoffs in the final report
- do not stop for routine confirmation in the middle of a normal scoped batch

---

## 19. No silent refactor rule

Do not refactor unrelated code as part of a scoped task.

If refactoring is truly necessary:

- keep it narrow
- explain it clearly
- do not change unrelated behavior
- do not move files around without a documented reason
- make sure the refactor pays for itself in clarity, stability, or reuse

---

## 20. Technical direction

Assume the intended stack is:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Match the existing project direction instead of introducing parallel frameworks, state libraries, styling systems, or architectural styles without a documented reason.

---

## 21. Default first focus when no specific task is given

If no specific task is provided, start by auditing the current app against the intended product direction and choose the highest-leverage next implementation batch.

Default focus order:

1. trainer state flow
2. answer reveal flow
3. learning effectiveness after a choice is made
4. obvious state or behavior bugs
5. session-loop quality
6. content architecture support
7. lightweight coach behavior
8. UI consistency only where it supports the above

Do not default to random polish work.

---

## 22. Definition of good work in this repo

Good work in this repository has these qualities:

- improves learning quality
- improves decision clarity
- strengthens replay value
- keeps the app coherent
- preserves the product fantasy
- avoids fake precision
- avoids unnecessary complexity
- remains extensible for future phases
- keeps docs and implementation aligned

The right direction is not “more stuff”.
The right direction is **better trainer behavior, stronger learning loops, and cleaner product execution**.