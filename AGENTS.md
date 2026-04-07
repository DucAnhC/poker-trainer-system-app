# AGENTS.md

# Purpose

This file gives future AI coding agents a stable operating contract for `poker-trainer-system`.

The product mission is to build a web-based No-Limit Texas Hold'em trainer that improves decision quality through structured scenario practice, explanations, review, and progress tracking.

The product is not:

- a static chart browser
- a solver clone
- a real-money gambling tool
- a poker forum or content dump

## 1. Product mission

Build a training platform that helps learners:

- think in ranges instead of guessing one exact hand
- make decisions with context: position, stack depth, action history, board texture, and player type
- separate decision quality from short-term results
- learn baseline play before layering exploitative adjustments
- review recurring mistakes and improve over time

## 2. Read this before coding

Before making changes, read:

1. `/specs/poker-trainer-system/proposal.md`
2. `/specs/poker-trainer-system/requirements.md`
3. `/specs/poker-trainer-system/design.md`
4. `/specs/poker-trainer-system/tasks.md`
5. `/PROJECT_RULES.md`
6. relevant handbook files in `/docs/handbook/`

Do not start implementation from assumptions when the repo already has an approved spec.

## 3. Specs-first rule

If a task changes any of the following, update the related spec files first or in the same change:

- product scope
- training modes
- scenario schema
- explanation model
- persistence model
- progress metrics
- architecture boundaries

Do not silently drift away from the docs.

## 4. Scope control

Always check the current phase in `/specs/poker-trainer-system/tasks.md`.

- If the requested work is in phase, implement it cleanly.
- If the requested work crosses into later phases, pause and call out the scope change.
- Do not bundle future-phase work just because it feels adjacent.

When in doubt, deliver the smallest complete slice that matches the active phase.

## 5. Poker-domain guardrails

All poker logic must respect these rules:

- Teach ranges, not exact-hand certainty.
- Context matters. Position, stack depth, board texture, action history, and player type should not be ignored when the spot depends on them.
- Avoid absolute claims like "always bet here" unless the content is explicitly labeled as a simplification.
- Distinguish `simplification`, `baseline`, and `exploit` guidance.
- Do not invent complex solver-level detail unless the product scope explicitly needs it.
- If uncertain about a poker recommendation, choose the more conservative explanation and label the assumption.

## 6. Handling uncertain poker logic

If a spot is strategically sensitive or simplified:

- state the assumption in the content or code comments where appropriate
- label whether the answer is a beginner heuristic, baseline recommendation, or exploit
- prefer explanation blocks that say why the action fits the training assumptions
- avoid pretending a contested line is universally correct

When the repo uses mock content, keep the guidance practical and internally consistent rather than falsely over-precise.

## 7. Mock-data-first rule

Start with mock data and local persistence unless the current phase explicitly requires more.

- Seed scenarios should live in structured data files.
- Progress can start in local storage or mock adapters.
- Domain models should not depend on a database being present.
- Database work should be introduced only after the schemas and flows are stable.

## 8. Modularity rules

Keep the system modular from the start.

- separate domain models from UI components
- separate trainer flow logic from content definitions
- separate explanation rendering from recommendation logic
- separate progress tracking from session presentation
- keep module-specific files inside the feature that owns them

Do not create large files that mix several responsibilities.

## 9. Documentation update rule

Whenever you add or change:

- a feature module
- a scenario field
- an explanation block format
- a training mode
- a progress metric
- a major UX flow

also update the relevant docs:

- `/specs/poker-trainer-system/*.md`
- `/docs/handbook/*.md` when the learning content or framing changes
- `/README.md` when repository-level expectations change

## 10. UX principles for trainer screens

Trainer screens should feel educational and decision-focused.

Every trainer screen should make these visible:

- what the scenario is
- what decision is being asked
- what options are available
- what the recommended answer is after submission
- why the answer fits the context
- why a tempting wrong answer is weaker
- where the learner is in the session

Do not hide the teaching purpose behind decorative UI.

## 11. Baseline vs exploit vs simplification

Use these meanings consistently:

- `simplification`: a deliberately reduced teaching rule for beginners or MVP training
- `baseline`: a solid default strategy for common spots under the product's assumptions
- `exploit`: an adjustment based on opponent tendencies or a specific population read

If the UI or content shows one of these, the label should be explicit enough that the learner can tell what kind of advice they are seeing.

## 12. Development workflow rules

- Read the relevant specs before touching code.
- Confirm the change belongs in the current phase.
- Reuse existing types and naming conventions.
- Keep code readable and easy to review.
- Add or update mock content when new trainer behavior needs it.
- Manually test the affected flow.
- Summarize assumptions and scope in the final message.

## 13. File size and code organization

- Prefer small, focused files.
- Split large features into `components`, `lib`, `types`, and `data` as needed.
- Do not create giant `utils` or `constants` files that become dumping grounds.
- Keep scenario schemas and sample content separate from rendering code.
- Keep explanation builders separate from session state management.

If a file becomes difficult to understand in one screenful, consider splitting it.

## 14. No silent refactor rule

Do not refactor unrelated code as part of a scoped task.

If a refactor is truly necessary:

- keep it narrow
- explain it clearly
- do not change unrelated behavior
- do not move files around without a documented reason

## 15. Technical direction

Assume the intended stack is:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Match the existing project direction instead of introducing parallel frameworks or alternate styling systems without approval.
