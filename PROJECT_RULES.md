# PROJECT_RULES.md

## 1. Repository purpose

This repository exists to build a structured No-Limit Texas Hold'em training platform. It is not a generic poker content dump, not a real-money product, and not a solver replacement. Every feature should support decision training, explanation quality, or progress review.

## 2. Folder conventions

Use these top-level folders consistently:

- `/specs/poker-trainer-system`: product scope, requirements, design, and phased tasks
- `/docs/handbook`: educational content that maps to future trainer modules
- `/src/app`: route-level UI and page composition once implementation begins
- `/src/components`: shared presentational and UI components
- `/src/features`: module-specific code such as preflop, pot odds, progress, and hand review
- `/src/lib`: domain logic, content helpers, persistence helpers, and shared utilities
- `/src/data`: mock scenarios, handbook content mappings, and seed progress data
- `/src/types`: shared type definitions only when colocating types is no longer clearer

Do not create new top-level folders casually. If a new top-level area is needed, update the specs first.

## 3. Naming conventions

- Use `kebab-case` for folders and non-component files.
- Use `PascalCase` for React component files.
- Use `camelCase` for functions, variables, and object properties.
- Use explicit domain names such as `playerArchetypeId`, `effectiveStackBb`, and `rationaleBlocks`.
- Avoid ambiguous names like `data.ts`, `helpers.ts`, or `utils.ts` when a narrower name is possible.

## 4. Specs-first rule

Update the spec files before or alongside code when any of the following change:

- feature scope
- training flow
- scenario schema
- explanation format
- persistence model
- progress metrics
- module boundaries

If implementation and specs conflict, the specs win until they are deliberately updated.

## 5. Content conventions

All training content must reinforce the project's teaching philosophy:

- Think in ranges, not single exact hands.
- Decisions are context-dependent.
- Action should have a purpose, not "information gathering" by default.
- Beginner heuristics, baseline strategy, and exploits must be separated.
- Decision quality matters more than a short-term result.
- Simplifications must be labeled as simplifications.

Do not write content that presents a single heuristic as universally correct in all games.

## 6. Scenario data conventions

A training scenario is the minimum reusable unit of practice. Every scenario must contain enough context for a learner to answer and enough explanation for the system to teach something useful.

Every scenario should include:

- `id`: stable unique identifier
- `module`: `preflop`, `pot-odds`, `board-texture`, `player-types`, `postflop`, or `hand-review`
- `mode`: trainer mode such as `quick-quiz` or `scenario-drill`
- `title`: short learner-facing title
- `learningGoal`: what skill the scenario is testing
- `prompt`: the question shown to the learner
- `street`: `preflop`, `flop`, `turn`, `river`, or `meta`
- `heroPosition`: standardized table position when relevant
- `villainPosition`: standardized table position when relevant
- `effectiveStackBb`: effective stack in big blinds when relevant
- `actionHistory`: normalized action sequence
- `board`: board data for postflop or texture-based spots
- `playerArchetypeId`: opponent profile reference if exploit logic matters
- `candidateActions`: available learner choices
- `recommendedActionId`: best training answer for the assumptions of the scenario
- `rationaleBlocks`: explanation units used in feedback
- `mistakeTags`: recurring leak labels tied to wrong answers
- `difficulty`: `beginner`, `intermediate`, or `advanced-lite`
- `sourceType`: `simplification`, `baseline`, or `exploit`
- `assumptions`: explicit labels for any simplifications
- `tags`: reusable filtering and analytics tags
- `version`: content version for future migrations

Do not ship partial scenarios that require hidden context to make sense.

## 7. Explanation conventions

Each explanation should be structured so it can work in immediate feedback, session review, and future spaced repetition.

Each explanation set should contain:

- direct answer summary
- why the recommended action performs best in this spot
- which context factors matter most
- why at least one plausible alternative is weaker
- what beginner simplification is being used, if any
- mistake correction language tied to leak tags

Explanations should be short enough to scan but specific enough to teach.

## 8. Training content schema expectations

Content should be authored so it can support multiple interfaces without rewriting the underlying material.

- Handbook content teaches concepts.
- Scenarios test applied decisions.
- Tags connect concepts, mistakes, modules, and difficulty.
- Rationale blocks allow one scenario to power instant feedback and later review.
- Progress records should point back to scenario ids and mistake tags.

When adding content, think about reuse across dashboard summaries, session review, and analytics.

## 9. Mock data and future database conventions

Use mock data first.

- Store early content in `/src/data/` as typed objects or JSON-like structures.
- Prefer stable ids and normalized enums from the start.
- Keep content portable so it can later move into a database without changing the meaning of fields.
- Do not couple trainer logic to storage implementation details.
- Treat local storage or mock persistence as a temporary adapter, not the domain model.

## 10. UI and trainer conventions

Every trainer screen should make the learner's job clear.

Minimum trainer screen expectations:

- scenario context is visible
- choices are explicit
- answer submission is clear
- feedback appears immediately after answering
- explanation highlights context, not only the final action
- tags or key concepts are visible
- session progress is visible

Avoid flashy UX that hides the teaching goal.

## 11. What qualifies as done

A task is only done when:

- the feature or content works for the scoped use case
- poker assumptions are documented
- types or schemas are consistent
- empty and error states are handled
- related docs are updated if behavior or scope changed
- mock data is added or updated when relevant
- there are no unrelated edits mixed into the task

## 12. How to update specs

When scope changes:

1. Update `proposal.md` if the product vision or non-goals move.
2. Update `requirements.md` if behavior or acceptance criteria move.
3. Update `design.md` if schema, architecture, or data flow move.
4. Update `tasks.md` if delivery order or phase scope moves.
5. Update handbook docs if the learning model or concept framing changes.

Do not update only one file when the change clearly affects several.

## 13. Commit conventions

Use focused commit prefixes:

- `feat:` new user-facing capability
- `fix:` bug fix or correction
- `docs:` documentation or handbook change
- `refactor:` internal structural improvement with no intended behavior change
- `test:` added or updated tests
- `chore:` maintenance work

Keep commits scoped to one change set. Do not mix docs, refactors, and product behavior changes without a clear reason.

## 14. File size and organization rules

- Avoid giant files that combine domain logic, UI, and content.
- Split modules by responsibility before a file becomes difficult to scan.
- Keep scenario schemas, explanation helpers, and persistence adapters separate.
- Prefer colocating small types with the feature that owns them.

If a file becomes hard to review in one pass, it is too large.

## 15. No silent refactor rule

Do not refactor unrelated code while working on a scoped task.

If a refactor is necessary to complete the work safely:

- keep it minimal
- explain it in the final summary
- preserve existing behavior
- avoid hidden folder structure changes
