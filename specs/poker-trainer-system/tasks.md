# Tasks: poker-trainer-system

## Delivery approach

Build the product in phases. Each phase should produce a usable, reviewable slice of the system without forcing future-phase complexity into the current implementation.

## Phase 0: Docs, specs, and foundation planning

### Goals

- define product scope
- align vocabulary and training philosophy
- document architecture and data models
- create repo rules for future implementation

### Tasks

- write the proposal document
- write detailed requirements
- write the design and architecture plan
- define phased implementation tasks
- create handbook structure for core poker learning topics
- create AI-agent and repository governance files
- align README and operational checklist with the docs-first workflow

### Deliverables

- complete spec set in `/specs/poker-trainer-system/`
- handbook docs in `/docs/handbook/`
- updated `/README.md`, `/AGENTS.md`, `/PROJECT_RULES.md`, and `/TASK.md`

### Dependencies

- none

### Out of scope

- application code
- package installation
- backend setup
- authentication

## Phase 1: App scaffold and domain foundation

### Goals

- create the basic app shell
- implement shared domain types and mock content loading
- establish the reusable trainer infrastructure

### Tasks

- scaffold the Next.js app structure
- configure TypeScript, Tailwind CSS, and shadcn/ui in line with the chosen stack
- create route structure for dashboard, trainer modules, handbook, and hand review
- implement shared domain types for scenarios, rationale blocks, attempts, sessions, and notes
- add initial mock data files for each MVP module
- implement local storage adapters for progress and notes
- build a shared training session state model

### Deliverables

- runnable app shell
- typed domain models
- mock scenario data for MVP modules
- storage helpers for local progress and notes

### Dependencies

- Phase 0 specs must be accepted

### Out of scope

- advanced analytics
- database integration
- sophisticated postflop trees

## Phase 2: MVP training modules

### Goals

- ship the first complete learner experience
- prove that the shared training loop works across multiple modules

### Tasks

- build the dashboard with module cards and basic progress summary
- build the preflop trainer flow
- build the pot odds quiz flow
- build the board texture quiz flow
- build the player type exploit quiz flow
- build the hand review note flow
- build a reusable feedback panel for explanations
- build a reusable session summary screen
- connect handbook pages to relevant modules where appropriate

### Deliverables

- working MVP module screens
- immediate answer feedback and explanation rendering
- local progress recording
- initial empty states and error handling

### Dependencies

- Phase 1 shared domain and app shell
- seeded content for each module

### Out of scope

- login and syncing
- deep review analytics
- advanced personalization

## Phase 3: Richer poker logic and progress features

### Goals

- deepen training quality without abandoning the modular MVP structure
- improve learning continuity and progress usefulness

### Tasks

- expand preflop content coverage by spot family and stack depth
- add more postflop-concept scenarios and richer board classifications
- add confidence rating or self-assessment after answers if still aligned with product goals
- improve progress views with module trends and mistake-tag summaries
- add filters by difficulty, concept, or leak tag
- improve explanation rendering so it highlights the specific wrong-answer temptation
- refine handbook-to-scenario mapping

### Deliverables

- broader scenario library
- better progress views
- stronger explanation feedback

### Dependencies

- stable MVP session model
- consistent scenario schema from earlier phases

### Out of scope

- solver-backed live calculations
- account system

## Phase 4: Postflop trainer lite and explanation quality

### Goals

- add a lightweight postflop trainer without building a full advanced engine
- make explanation quality more consistent across modules
- connect postflop and review signals into progress guidance

### Tasks

- add a new `/trainer/postflop` route using the shared session flow
- seed a small mock postflop scenario set across flop, turn, and river decisions
- improve the shared feedback panel so explanations use a predictable answer, reasoning, alternative-line, and mistake-pattern structure
- extend leak tags with postflop-oriented mistake patterns
- let postflop attempts flow into dashboard summaries and recommendation heuristics
- connect structured hand review uncertainty to next-step module suggestions where practical

### Deliverables

- working postflop trainer module
- consistent feedback structure across training modules
- postflop-aware progress and recommendation summaries
- review-to-module suggestion heuristics

### Dependencies

- stable shared training shell from earlier phases
- typed scenario schema and local progress model from Phase 3

### Out of scope

- backend analytics infrastructure
- full solver-like postflop tree logic
- hand-history import or coaching systems

## Phase 5: Local-first polish and maintainability

### Goals

- make the app feel more complete without adding backend complexity
- improve study continuity with recent session history and weakness-based guidance
- harden local persistence and content authoring for future growth

### Tasks

- record active and completed sessions locally so recent study history is visible
- add safe reset, export, and import utilities for browser-stored progress and review data
- improve the dashboard with weakness-based focus guidance, recent weak-session summaries, and clearer resume flows
- keep recommendations heuristic and transparent by combining low-accuracy modules, repeat leak tags, and recent weak sessions
- tighten local persistence into a clearer app-data snapshot suitable for backup and restore
- add lightweight scenario-authoring validation so future content sets keep consistent IDs, actions, and explanation blocks

### Deliverables

- local session history visible on the dashboard
- safe local export, import, and reset utilities
- weakness-based focus guidance and better dashboard usability
- more consistent content authoring structure for mock scenario growth

### Dependencies

- stable local training, review, and recommendation loops from earlier phases

### Out of scope

- backend syncing, authentication, or database migration
- advanced spaced repetition or full custom study-plan systems
- anything that turns the product into a real-time assistance tool during live play

## Phase 6A: Guided study flow and adaptive practice

### Goals

- make the app feel like a connected learning system instead of isolated drills
- introduce lightweight progression by difficulty, content pack, and recent weak concepts
- keep all recommendations transparent, local-first, and mock-data-friendly

### Tasks

- represent difficulty consistently across training modules using `beginner`, `intermediate`, and `advanced-lite`
- organize scenario content into module-aligned content packs such as preflop basics or pot odds basics
- add module-level difficulty filters and lightweight adaptive ordering for weak concepts
- build a retry queue that resurfaces repeat misses or leak-linked concepts without a full spaced-repetition engine
- improve dashboard guidance with study-path steps, weak-difficulty summaries, and retry-focused recommendations
- keep content validation strict enough to catch missing content-pack metadata or duplicate scenario identifiers

### Deliverables

- difficulty-aware module flows
- content-pack metadata and validation
- adaptive recommendations that factor in weak modules, weak levels, recent sessions, and leak tags
- spaced-repetition-lite review through local retry queues
- dashboard study-path guidance and clearer focus signals

### Dependencies

- stable Phase 5 local persistence and recommendation heuristics
- shared scenario schema and explanation blocks from earlier phases

### Out of scope

- backend-driven personalization
- academically rigorous spaced repetition algorithms
- multi-user learning plans or admin-authored curriculum tooling

## Ongoing rules across all phases

- keep docs in sync with behavior
- do not silently change the scenario schema
- label simplifications clearly
- prefer small, reviewable iterations
- avoid mixing future-phase work into current-phase tasks without explicit approval
