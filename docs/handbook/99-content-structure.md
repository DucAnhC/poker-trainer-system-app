# 99. Content Structure

## Learning goal

Define how educational content should be organized across the system so future scenario writing, handbook updates, and UI implementation all work from the same structure.

## Core content layers

### Concepts

Concepts are the teaching ideas the learner needs to understand.

Examples:

- range thinking
- opening ranges
- stack depth
- range advantage
- pot odds
- player archetypes
- leak identification

Concepts usually live in handbook content first, then appear in scenario tags and explanations.

### Content packs

Content packs are the module-level bundles that group scenarios into a teachable progression.

Examples:

- preflop basics
- pot odds basics
- board texture basics
- player types basics
- postflop continuation spots

A content pack should define the module, concept emphasis, supported difficulty levels, and its place in the lightweight study path.

### Scenarios

Scenarios are the smallest reusable training units. A scenario applies one or more concepts in a decision spot.

A good scenario should include:

- a clear prompt
- enough context to answer
- a deliberate recommended action for the scenario assumptions
- explanation blocks that teach the decision
- mistake tags that classify likely wrong answers

### Tags

Tags connect concepts, scenarios, modules, and progress analytics.

Useful tag categories:

- module tags such as `preflop` or `pot-odds`
- concept tags such as `range-advantage` or `implied-odds`
- situational tags such as `btn-vs-bb` or `100bb`
- leak tags such as `ignored-position` or `chased-bad-draw`
- source tags such as `simplification`, `baseline`, or `exploit`

### Difficulty levels

Difficulty should describe how much judgment the scenario requires, not how scary it looks.

Recommended levels:

- `beginner`: direct concept application with limited ambiguity
- `intermediate`: more contextual inputs or closer competing answers
- `advanced-lite`: multi-factor judgment, thinner value, or more strategic nuance without pretending the app is solver-grade

Difficulty should not be used to hide missing explanation quality.

### Explanation blocks

Explanations should be modular blocks, not one giant paragraph.

A strong explanation set usually contains:

- answer summary
- core reason
- context factors
- weaker alternative explanation
- assumption label when needed
- mistake correction note when the learner chose a common wrong answer

This format supports immediate feedback, review pages, the current spaced-repetition-lite retry queue, and future spaced repetition.

### Mistake tags

Mistake tags classify why an answer went wrong.

Examples:

- `opened-too-wide`
- `dominated-call`
- `autocbet`
- `ignored-price`
- `bluffed-station`
- `result-oriented`

Mistake tags should be reusable across modules wherever the underlying leak is the same.

## Module mapping

Content should map cleanly from concept to training mode.

Examples:

- `positions` -> preflop trainer
- `pot-odds` -> pot odds quiz
- `board-texture` -> board texture quiz and postflop explanations
- `player-types` -> exploit quiz
- `review-habit` -> hand review notes and progress sessions

This mapping helps the dashboard recommend what to study next.

## Beginner versus intermediate separation

The product must clearly separate teaching layers.

### Beginner content

Use when the goal is habit formation and clarity.

Characteristics:

- simpler decision trees
- explicit labels for simplifications
- fewer competing edge cases
- stronger emphasis on common mistakes

### Intermediate content

Use when the learner already understands core patterns.

Characteristics:

- more context-sensitive decisions
- more discussion of tradeoffs
- more comparison between baseline and exploit
- more nuanced board and range interaction

A learner should never be forced into intermediate complexity by accident because content labeling was unclear.

## Content authoring guidance

When writing handbook content or scenarios:

- start from the learner decision, not from trivia
- include enough context to make the answer teachable
- avoid absolute poker claims unless they are deliberate simplifications
- label every simplification clearly
- connect each scenario to at least one concept tag
- connect likely wrong answers to mistake tags
- keep explanation language practical and readable
- prefer reusable wording over one-off clever copy

## Definition of a complete scenario

A complete training scenario should contain:

- stable id
- module, content pack, and mode
- title and learning goal
- decision prompt
- contextual fields such as position, board, action history, stack depth, or player type when relevant
- candidate actions
- recommended action
- source type
- assumptions
- rationale blocks
- mistake tags
- difficulty
- reusable tags

If one of these is missing, the scenario is probably not implementation-ready.

## How content should evolve

As the product grows:

- keep ids stable
- keep tags consistent
- extend schemas carefully rather than replacing them casually
- add richer explanation blocks before adding flashy UI complexity
- expand postflop depth only after the baseline learning flow remains clear

The content system should stay modular, educational, and implementation-friendly.
