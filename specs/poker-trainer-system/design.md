# Design: poker-trainer-system

## 1. Design goals

The architecture should support a modular training product with a small MVP and clean expansion paths.

The design goals are:

- keep learning content reusable across multiple training modes
- keep domain concepts separate from UI rendering
- make explanations first-class data, not afterthought text blobs
- support mock data now and a database later
- make progress tracking possible without requiring backend complexity
- keep poker assumptions explicit

## 2. System overview

The planned system is a Next.js application with a content-driven training core.

At a high level:

1. The learner selects a module or session.
2. The app loads mock scenario content for that module.
3. A shared training shell presents one scenario at a time.
4. The learner answers.
5. The app evaluates the answer against the scenario's recommended action.
6. The app renders explanation blocks and records an attempt.
7. Session progress is summarized and stored locally.

The MVP should behave like a single-user learning app with local persistence and seed content.

## 3. App and module boundaries

### 3.1 App shell

Owns:

- routing
- top-level layout
- module entry points
- dashboard
- handbook pages

Should not own:

- poker-specific decision logic
- scenario evaluation rules
- progress calculations beyond orchestration

### 3.2 Content module

Owns:

- scenario definitions
- handbook content mappings
- module metadata
- content-pack metadata
- content tags and difficulty labels

Should not own:

- rendering decisions
- persistence adapters

### 3.3 Training engine

Owns:

- session creation
- difficulty filtering and adaptive retry ordering
- scenario sequencing
- answer evaluation
- feedback state transitions

Should not own:

- permanent storage concerns
- handbook prose

### 3.4 Explanation engine

Owns:

- rationale block formatting
- answer-specific feedback composition
- source-type and assumption labeling
- alternative-action comparison text assembly

Should not own:

- scenario selection
- session persistence

### 3.5 Progress module

Owns:

- attempt recording
- session summaries
- module-level and difficulty-level rollups
- leak-tag aggregation
- retry queue heuristics and study-path guidance
- local-storage adapters in the MVP

Should not own:

- poker explanations
- scenario definitions

### 3.6 Hand review module

Owns:

- note creation
- note editing
- note tags
- note listing

Should not own:

- automatic hand parsing in the MVP

## 4. Proposed feature modules

- `dashboard`: learner home, module launch, recent progress
- `preflop`: structured preflop decision training
- `pot-odds`: math and drawing quiz logic
- `board-texture`: board classification and strategic takeaway quiz
- `postflop`: lightweight flop, turn, and river decision training
- `player-types`: exploit adjustment practice
- `progress`: summaries, recent attempts, leak trends
- `hand-review`: lightweight note-taking and reflection
- `handbook`: concept reference mapped to training content

## 5. Screen and page ideas

Suggested future pages:

- `/`: lightweight landing or redirect to dashboard
- `/dashboard`: module cards, recent progress, quick resume
- `/trainer/preflop`: preflop trainer session entry and live session
- `/trainer/pot-odds`: pot odds quiz
- `/trainer/board-texture`: board texture quiz
- `/trainer/postflop`: lightweight postflop trainer
- `/trainer/player-types`: player type exploit quiz
- `/review`: hand review note list, create flow, detail view, and lightweight delete flow
- `/progress`: deeper progress overview after MVP
- `/handbook`: handbook index
- `/handbook/[slug]`: concept article pages

The live training experience can be page-based or use nested routes later, but the domain flow should remain the same.

## 6. Data flow

### 6.1 Training session flow

1. Learner opens a module.
2. App loads module metadata and scenario pool.
3. Training engine selects a session subset.
4. UI renders current scenario.
5. Learner submits an answer.
6. Engine evaluates answer and attaches explanation blocks.
7. Progress module records an attempt.
8. UI shows feedback and allows next step.
9. End-of-session summary aggregates attempts and mistake tags.
10. Dashboard reads stored summaries for later display.

### 6.2 Handbook flow

1. Learner opens handbook content.
2. App renders static concept content.
3. Concept pages link concept tags to relevant modules or exercises.

### 6.3 Hand review flow

1. Learner creates a structured review note.
2. Note is stored locally through a review adapter.
3. The learner assigns optional leak tags manually.
4. Dashboard or review pages can show recent notes and use those tags inside recommendation heuristics.

## 7. Domain model

The domain should favor normalized enums and reusable scenario shapes.

### 7.1 Core enums

```ts
type TrainingModule =
  | "preflop"
  | "pot-odds"
  | "board-texture"
  | "player-types"
  | "postflop"
  | "hand-review";

type Difficulty = "beginner" | "intermediate" | "advanced-lite";

type SourceType = "simplification" | "baseline" | "exploit";

type Street = "preflop" | "flop" | "turn" | "river" | "meta";

type Position = "UTG" | "HJ" | "CO" | "BTN" | "SB" | "BB";

type HandCategory =
  | "premium-pair"
  | "strong-broadway"
  | "offsuit-broadway"
  | "suited-broadway"
  | "suited-ace"
  | "small-pair"
  | "suited-connector"
  | "suited-gapper"
  | "weak-offsuit"
  | "trash";
```

### 7.2 Shared supporting models

```ts
interface StackDepthBucket {
  id: "20bb" | "40bb" | "60bb" | "100bb";
  minBb: number;
  maxBb: number;
  label: string;
  trainingNotes: string[];
}

interface PlayerArchetype {
  id: "nit" | "tag" | "lag" | "calling-station" | "maniac" | "passive-rec";
  name: string;
  description: string;
  commonLeaks: string[];
  defaultAdjustments: string[];
}

interface BoardTextureProfile {
  id: string;
  flop: [string, string, string];
  turn?: string;
  river?: string;
  suitedness: "rainbow" | "two-tone" | "monotone";
  connectedness: "disconnected" | "semi-connected" | "highly-connected";
  pairedness: "unpaired" | "paired" | "double-paired";
  dynamicLevel: "static" | "medium" | "dynamic";
  notes: string[];
}

interface LeakTag {
  id: string;
  label: string;
  category:
    | "range-thinking"
    | "math"
    | "discipline"
    | "player-adjustment"
    | "postflop-planning"
    | "review-habit";
  description: string;
}

interface RationaleBlock {
  id: string;
  kind:
    | "answer"
    | "core-reason"
    | "context-factor"
    | "alternative-action"
    | "mistake-correction"
    | "assumption";
  title: string;
  body: string;
  emphasis?: "low" | "medium" | "high";
}
```

### 7.3 Scenario base model

```ts
interface CandidateAction {
  id: string;
  label: string;
  actionType: "open" | "check" | "bet" | "call" | "raise" | "3bet" | "4bet" | "fold";
  feedbackHint?: string;
}

interface ScenarioBase {
  id: string;
  module: TrainingModule;
  contentPackId: string;
  mode:
    | "quick-quiz"
    | "scenario-drill"
    | "preflop-trainer"
    | "pot-odds-quiz"
    | "board-texture-quiz"
    | "player-type-quiz";
  title: string;
  learningGoal: string;
  prompt: string;
  street: Street;
  difficulty: Difficulty;
  sourceType: SourceType;
  tags: string[];
  assumptions: string[];
  rationaleBlocks: RationaleBlock[];
  candidateActions: CandidateAction[];
  recommendedActionId: string;
  mistakeTags: string[];
  version: number;
}
```

### 7.4 Preflop scenario model

```ts
interface PreflopScenario extends ScenarioBase {
  module: "preflop";
  street: "preflop";
  heroPosition: Position;
  villainPosition?: Position;
  handLabel: string;
  handCategory: HandCategory;
  effectiveStackBb: number;
  actionHistory: string[];
  potType: "unopened" | "vs-open" | "vs-3bet" | "vs-4bet";
}
```

### 7.5 Postflop or concept scenario model

```ts
interface PostflopScenario extends ScenarioBase {
  module: "board-texture" | "postflop" | "player-types" | "pot-odds";
  heroHand?: string;
  heroPosition?: Position;
  villainPosition?: Position;
  effectiveStackBb?: number;
  actionHistory?: string[];
  board?: BoardTextureProfile;
  playerArchetypeId?: PlayerArchetype["id"];
  potSizeBb?: number;
  betToCallBb?: number;
  outsCount?: number;
  equityHint?: string;
}
```

### 7.6 Attempt and session models

```ts
interface QuizAttempt {
  id: string;
  sessionId: string;
  scenarioId: string;
  module: TrainingModule;
  selectedActionId: string;
  recommendedActionId: string;
  isCorrect: boolean;
  sourceType: SourceType;
  difficulty: Difficulty;
  mistakeTags: string[];
  conceptTags: string[];
  createdAt: string;
}

interface TrainingSession {
  id: string;
  module: TrainingModule;
  startedAt: string;
  completedAt?: string;
  scenarioIds: string[];
  correctCount: number;
  attemptIds: string[];
  surfacedLeakTags: string[];
}

interface HandReviewNote {
  id: string;
  title: string;
  streetFocus: "preflop" | "flop" | "turn" | "river" | "general";
  heroPosition: Position | null;
  villainPosition: Position | null;
  effectiveStackBb: number | null;
  board: string;
  actionHistorySummary: string;
  chosenAction: string;
  uncertainty: string;
  note: string;
  leakTagIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 8. Data structure ideas for scenarios

Scenarios should be content-first and renderable without hidden logic. A scenario should contain enough data that the training engine only needs to:

- display the prompt and context
- compare selected and recommended action ids
- render explanation blocks
- record progress

This reduces coupling between UI and poker logic.

Recommended scenario authoring pattern:

- keep normalized fields for filtering and analytics
- keep learner-facing copy inside the scenario object
- keep explanation blocks modular
- avoid computing essential explanation text entirely in the UI layer

## 9. Training loop design

The core training loop should be simple and repeatable.

### 9.1 Session setup

- learner chooses module or content pack
- learner can keep all levels visible or focus on a specific difficulty when the module supports it
- adaptive order can optionally surface weak concepts before the rest of the pack
- engine selects a small scenario set from mock data

### 9.2 In-session flow

- show scenario context first
- present 3 to 5 candidate actions
- allow answer submission
- lock answer after submission for the MVP
- show immediate feedback
- show explanation blocks in a predictable order

Suggested explanation order:

1. answer summary
2. core reason
3. context factors
4. weaker alternative explanation
5. mistake pattern when relevant
6. assumption label

### 9.3 Session summary

- correct answers out of total
- modules or concepts touched
- common mistake tags from the session
- prompt to continue, review handbook content, or add a hand note

## 10. Explanation engine concept

The explanation engine does not need to calculate poker theory dynamically in the MVP. Instead, it should compose stored rationale blocks into a consistent feedback experience.

Benefits of this approach:

- explanation quality can be authored deliberately
- content is consistent across modules
- the same rationale blocks can be reused in session review or spaced repetition later
- simplifications and exploit labels are easy to surface

In later phases, the explanation engine can become smarter about selecting emphasis or tailoring the feedback based on the wrong answer chosen.

## 11. Progress tracking concept

The progress system should answer three questions:

1. How much has the learner trained?
2. Which modules are stronger or weaker?
3. Which mistake themes keep repeating?

MVP progress can be built from local attempt records and derived summaries.

Useful derived views:

- recent sessions
- module accuracy
- weak difficulty areas
- most frequent mistake tags
- content-pack exposure and completion signals
- retry queue suggestions for repeated misses
- simple next-step recommendations and study-path steps based on weak modules, repeat leak tags, weak levels, or missing review habits

## 12. Mock-data-first strategy

The MVP should use structured mock content stored in the repository.

Why this is the right first step:

- it keeps the product focused on the training loop
- it lets scenario schema stabilize before database work
- it is easier to validate content quality early
- it reduces implementation overhead during the foundation phase

Recommended mock content layout:

```text
src/data/
  content-packs.ts
  scenarios/
    preflop/
    pot-odds/
    board-texture/
    player-types/
    postflop/
```

## 13. Migration path from mock data to a real database

The design should allow a later swap from local files and local storage to persistent backend storage.

Planned migration approach:

1. Keep scenario ids stable from the beginning.
2. Keep scenario objects serializable.
3. Isolate read and write operations behind content and persistence adapters.
4. Store attempts and notes using domain models that do not depend on UI state shape.
5. Introduce database-backed repositories later without changing trainer-screen contracts.

The database migration should feel like changing adapters, not changing the product model.

## 14. Assumptions and tradeoffs

### Assumptions

- early training content will sometimes use simplified heuristics
- most early spots will be single-opponent and six-max oriented
- stack depth can be bucketed instead of modeled continuously in the MVP
- progress can be approximate and still be useful in the first release

### Tradeoffs

- authored explanations are less dynamic than solver-backed logic, but they are faster to ship and easier to validate
- a mock-data-first system is less scalable initially, but it keeps the MVP clean and focused
- limiting early scope to major modules improves delivery speed, even though it leaves deeper postflop play for later phases

This design intentionally chooses clarity, modularity, and educational usefulness over excessive complexity.





