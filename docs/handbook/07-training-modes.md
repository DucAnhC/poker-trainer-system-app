# 07. Training Modes

## Learning goal

Define the training modes the product should support so future implementation stays aligned with the educational purpose of the platform. These are product modes, not just page names. Each mode should have a clear learning outcome, session shape, and content requirement.

## Core training modes

### Quick quiz

Purpose:

- deliver short, focused practice bursts
- reduce friction for daily training

Best for:

- one-concept review
- light repetition
- mobile-friendly usage

Content needs:

- short prompt
- few answer choices
- immediate explanation
- lightweight progress recording

### Scenario drill

Purpose:

- train applied decisions with richer context
- reinforce the difference between similar-looking spots

Best for:

- preflop branches
- postflop concept practice
- exploit adjustments with enough detail to matter

Content needs:

- clear scenario setup
- action history
- contextual explanation blocks
- mistake tags

### Preflop trainer

Purpose:

- build strong early-street habits around opens, calls, 3-bets, 4-bets, and folds

Best for:

- position training
- stack-depth training
- versus-open and versus-3-bet practice

Content needs:

- hero position
- villain position when relevant
- effective stack
- action history
- action choices
- range-based explanation

### Pot odds quiz

Purpose:

- sharpen practical math discipline
- prevent bad calls driven by hope

Best for:

- outs counting
- price awareness
- simple call or fold decisions

Content needs:

- pot size
- call size
- draw or hand description
- beginner-friendly math explanation

### Board texture quiz

Purpose:

- teach that flops and runouts should not be treated the same

Best for:

- dry versus dynamic recognition
- pairedness and suit texture understanding
- simple range-advantage teaching

Content needs:

- board display
- classification or strategic takeaway question
- explanation tied to board interaction

### Postflop trainer

Purpose:

- train simple flop, turn, and river action decisions without pretending to solve full postflop trees

Best for:

- c-bet versus check decisions
- turn barrel discipline
- one-pair pot-control spots
- fold versus call discipline when player type matters

Content needs:

- hero hand
- board cards for the current street
- action history
- available actions
- concise explanation blocks tied to board texture, range interaction, pot control, or player type

### Player type exploit quiz

Purpose:

- train controlled deviations from baseline strategy

Best for:

- value-betting adjustments
- bluff-discipline adjustments
- population-read awareness

Content needs:

- named or described player archetype
- spot context
- explicit baseline-versus-exploit explanation

### Hand review notes

Purpose:

- turn mistakes into reflection and repeatable learning

Best for:

- recording leaks
- summarizing lessons learned
- connecting confusing hands to concepts

Content needs:

- note title
- street focus
- hero and villain position when relevant
- action history summary
- chosen action and main uncertainty
- optional note
- leak tags

### Progress sessions

Purpose:

- help the learner review what happened across recent training

Best for:

- module summaries
- leak trend spotting
- deciding what to study next

Content needs:

- recent attempts
- module accuracy summaries
- mistake-tag rollups
- suggested next module or handbook topic

### Future spaced repetition mode

Purpose:

- revisit weak concepts and recurring mistakes at the right time

Best for:

- memory reinforcement
- fixing repeated leaks
- turning short-term feedback into long-term improvement

Content needs:

- stable scenario ids
- concept tags
- mistake-tag history
- scheduling rules in a later phase

## Practical interpretation

These modes should share a common system language even when their UI differs.

Shared expectations across modes:

- the learner always knows what question is being asked
- the learner always gets meaningful feedback after answering
- progress is always captured in a reusable way
- concepts and mistake tags always map back to handbook ideas

## How this concept turns into implementation planning

The MVP should prioritize:

- dashboard
- preflop trainer
- postflop trainer
- pot odds quiz
- board texture quiz
- player type exploit quiz
- hand review notes
- basic progress sessions through summary screens and dashboard widgets

Scenario drill and spaced repetition can expand after the MVP once the shared training shell is stable.

## Content mapping

Suggested tags:

- `training-modes`
- `quick-quiz`
- `scenario-drill`
- `preflop-trainer`
- `postflop-trainer`
- `pot-odds-quiz`
- `board-texture-quiz`
- `player-type-quiz`
- `hand-review`
- `progress`
- `spaced-repetition`
