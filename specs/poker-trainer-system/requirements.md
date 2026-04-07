# Requirements: poker-trainer-system

## 1. Purpose

This document defines the behavior required to build the first usable versions of `poker-trainer-system`. The goal is to make the repository implementation-ready while keeping scope disciplined.

## 2. Product assumptions

The requirements below assume:

- the app is a web product built with Next.js and TypeScript
- the MVP uses mock data and local persistence
- the initial learning model is scenario-based
- most early scenarios reflect six-max, heads-up decision points unless a scenario states otherwise
- simplified training guidance is allowed only when labeled

## 3. User roles

### 3.1 Learner

The learner is the main user of the MVP. The learner must be able to:

- enter training modules
- answer scenarios
- receive explanations
- review progress
- write hand review notes

### 3.2 Content author or developer

This is an internal role for future expansion. The content author or developer must be able to:

- add new scenarios using a consistent schema
- label assumptions and source type
- map scenarios to handbook concepts, tags, and difficulty levels

Dedicated admin tooling is not required in the MVP, but the content model must support future authoring.

## 4. Functional requirements

### 4.1 Shared training shell

The system shall provide a reusable training flow that supports multiple modules.

The shared training shell must:

- start a session for a chosen module
- load a sequence of scenarios or quiz items
- display context before answer submission
- collect the learner's selected answer
- reveal feedback after submission
- show explanation content linked to the answer
- record attempt data
- allow moving to the next item
- end with a simple summary view

### 4.2 Dashboard

The system shall provide a dashboard that acts as the learner's home base.

The dashboard must show:

- available training modules
- a short summary of the learner's recent activity
- simple progress indicators by module or concept
- recent mistake themes or leak tags when available
- entry points to handbook content and hand review notes

### 4.3 Scenario engine

The system shall support reusable scenario-driven content.

The scenario engine must:

- accept structured scenario objects
- support preflop, postflop-concept, math, and exploit-oriented modules
- support answer choices with one recommended action for the scenario assumptions
- support metadata such as difficulty, tags, and source type
- support explanation blocks that can be rendered after answering
- support mistake tags on wrong answers
- support filtering by module, difficulty, or concept in future phases

### 4.4 Preflop trainer

The system shall provide a preflop trainer for common action decisions.

The preflop trainer must support scenarios involving:

- unopened pots
- facing an open
- facing a 3-bet
- facing a 4-bet where MVP scope allows
- decisions to open, call, 3-bet, 4-bet, limp-aware fold, or fold
- position-aware decisions
- stack-depth-aware decisions

The preflop trainer must present:

- hero position
- villain position when relevant
- effective stack
- action history
- available choices
- explanation tied to range-based thinking

### 4.5 Pot odds quiz

The system shall provide a pot odds and drawing-math quiz module.

The pot odds quiz must support:

- call or fold style questions based on pot size, bet size, and draw information
- rough outs counting questions
- quick equity-intuition prompts using simplified training assumptions
- implied-odds awareness in a beginner-friendly format

### 4.6 Board texture quiz

The system shall provide a board texture recognition module.

The board texture quiz must support:

- identifying dry versus coordinated flops
- paired versus unpaired boards
- static versus dynamic boards
- basic range-advantage and nut-advantage interpretation
- choosing the most sensible training takeaway for the board

This module is concept-focused in the MVP and does not need to solve full postflop trees.

### 4.7 Postflop trainer lite

The system shall provide a lightweight postflop decision-training module.

The postflop trainer must support:

- simple flop, turn, and river scenarios
- actions such as c-bet, check, call, raise, fold, continue barreling, and check back for pot control
- enough context to answer, including hero hand, board, positions, action history, stack depth, and player type when relevant
- concise explanation blocks that mention board texture, range interaction, value versus bluff, protection, pot control, or player-type adjustment when relevant
- clear distinction between baseline, exploit, and simplified training guidance

This module should stay intentionally scoped and does not need to solve a full advanced postflop engine.

### 4.8 Player type exploit quiz

The system shall provide a player-adjustment training module.

The player type exploit quiz must support:

- common archetypes such as nit, tight-aggressive regular, loose-aggressive player, calling station, maniac, and passive recreational player
- questions about when to value bet more, bluff less, call tighter, or apply pressure
- clear distinction between baseline and exploit logic

### 4.9 Hand review notes

The system shall provide a lightweight hand review notes area.

The hand review notes feature must support:

- creating a structured hand review note
- storing note title or label
- storing street focus, hero position, villain position, effective stack, and board when relevant
- storing an action history summary, the learner's chosen action, what the learner is unsure about, and an optional note
- assigning one or more leak tags manually
- viewing recent notes in a readable list and detail format
- deleting a saved note in the MVP

MVP hand review notes may use a structured local form and local persistence rather than hand-history parsing.

### 4.10 Handbook support

The system shall include handbook content that supports the trainer modules.

The handbook content must:

- explain major concepts in practical language
- align with the same terms used in scenario data
- connect concepts to future training exercises
- separate beginner heuristics from baseline play and exploit adjustments where relevant

### 4.11 Explanation requirements

Every scored scenario or quiz item must produce feedback that includes:

- the recommended answer
- a short summary of why it is correct under the scenario assumptions
- the key contextual factors that drive the answer
- a note on why at least one tempting alternative is weaker
- concept tags
- source type label when the answer is a simplification or exploit

Explanations must be concise enough for rapid training and structured enough for later review screens.

The explanation format should stay consistent across modules so the learner can quickly find:

- the direct answer summary
- the main reasoning behind the action
- the most important context factors
- why a tempting alternative is weaker
- the mistake pattern when the learner misses the spot

### 4.12 Progress tracking requirements

The system shall record basic learner progress.

The MVP progress system must store:

- session id
- module
- scenario id
- selected answer
- recommended answer
- correctness
- timestamp
- difficulty
- concept tags
- mistake tags triggered by wrong answers

The dashboard or summary views must be able to derive:

- total attempts
- recent accuracy
- module-level performance
- common mistake tags
- recent session history
- simple rule-based next-step recommendations

### 4.13 Content requirements

Training content must:

- cover the MVP modules with enough scenarios to demonstrate variation
- use consistent terminology for positions, stack depths, and player archetypes
- label simplified training logic clearly
- include practical examples, not only abstract definitions
- be modular so one concept can appear in handbook content and in scenarios

### 4.14 Error states and empty states

The system must handle the following gracefully:

- no scenarios available for a selected module
- progress history does not exist yet
- hand review notes list is empty
- saved data is invalid or cannot be parsed
- a scenario is missing optional context such as a board for non-postflop modules

Empty states should guide the learner toward the next useful action.

### 4.15 Maintainability requirements

The system must be maintainable by future developers and AI agents.

It must:

- use a documented scenario schema
- separate domain data from rendering logic
- keep modules small and composable
- avoid hidden assumptions in UI code
- allow mock persistence to be replaced later without rewriting the training flow
- use consistent naming across code, specs, and handbook content

## 5. MVP requirements

The MVP must include:

- dashboard
- preflop trainer
- pot odds quiz
- board texture quiz
- player type exploit quiz
- hand review notes
- local progress persistence
- session summary views
- handbook content for the core learning areas

The MVP does not need:

- authentication
- backend APIs
- multi-user support
- advanced analytics
- solver-backed precision

## 6. Post-MVP requirements

After the MVP, the system should grow into:

- richer postflop scenario drills across flop, turn, and river
- spaced repetition or weak-spot resurfacing
- deeper progress analytics and leak dashboards
- content filtering and custom training plans
- database-backed persistence
- account support if the product direction later requires it

## 7. User stories

- As a learner, I want to answer a preflop scenario so I can practice choosing between open, call, 3-bet, or fold.
- As a learner, I want to see why the answer is good so I improve the reasoning, not just the output.
- As a learner, I want a quick pot-odds quiz so I can sharpen math decisions without opening a calculator every time.
- As a learner, I want to recognize board textures so I stop treating all flops the same.
- As a learner, I want to practice exploit adjustments by opponent type so I can value bet and bluff more responsibly.
- As a learner, I want to save hand review notes so I can reflect on recurring mistakes.
- As a learner, I want to see recent progress so I know which modules and concepts need work.
- As a content author, I want a consistent scenario schema so new training content can be added without breaking the app.

## 8. Acceptance criteria

### 8.1 Shared training flow

- A learner can start a session from the dashboard or a module entry point.
- Each session presents at least one scenario with enough context to answer.
- After a learner submits an answer, the system shows the recommended action and explanation.
- The learner can move to the next scenario or finish the session.

### 8.2 Dashboard

- The dashboard shows all MVP modules.
- The dashboard shows meaningful content even when no progress exists yet.
- If progress exists, the dashboard shows at least one recent-history view and one aggregate view.

### 8.3 Preflop trainer

- A learner can complete a session containing position-aware preflop scenarios.
- At least some scenarios vary by stack depth and prior action.
- Feedback references ranges or range logic rather than only naming one hand.

### 8.4 Pot odds quiz

- A learner can answer pot-odds questions with fixed choices.
- Feedback includes the relevant math idea in plain language.
- Wrong answers can map to mistake tags such as chasing bad draws or ignoring price.

### 8.5 Board texture quiz

- A learner can identify the nature of a board or the most sensible takeaway from it.
- Feedback mentions why board texture changes strategy.

### 8.6 Postflop trainer lite

- A learner can complete a postflop session containing at least a few flop, turn, or river decision spots.
- Postflop scenarios show enough context to make the decision teachable, including hero hand and board state.
- Feedback explains the recommended action with a consistent answer-summary and reasoning structure.
- Wrong answers can surface postflop-oriented leak tags such as auto c-betting, weak turn discipline, or poor pot control.

### 8.7 Player type exploit quiz

- A learner can answer opponent-adjustment questions for at least several archetypes.
- Feedback explicitly says whether the answer is baseline or exploit-focused.

### 8.8 Hand review notes

- A learner can create, view, and delete notes without needing authentication.
- Notes persist locally across page reloads in the MVP.
- A learner can assign one or more leak tags manually during review.

### 8.9 Progress tracking

- The system records attempts for completed questions.
- A learner can see recent performance by module.
- The system can surface common mistake tags once enough attempts exist.
- The system can suggest a next module based on simple heuristic rules tied to accuracy, leak tags, review activity, or structured note uncertainty.

## 9. Non-functional requirements

- The app must be usable on desktop and mobile.
- The app must remain understandable without animation or visual flair.
- Module state should be fast enough that question transitions feel immediate for local mock data.
- The codebase must be TypeScript-first and implementation-friendly for future extension.
- Content and progress handling should degrade gracefully if persisted data is missing or malformed.
- The UI should follow accessible basics such as semantic controls, readable contrast, and clear interaction states.

## 10. Requirements for future implementation readiness

Coding may begin when:

- the specs are internally aligned
- the scenario schema is stable enough for mock data seeding
- module boundaries are clear
- the current phase in `tasks.md` is accepted

The implementation should not need a second planning pass to understand what an MVP scenario, explanation, or progress record must contain.



