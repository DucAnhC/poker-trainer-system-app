# 01. Poker Learning Principles

## Learning goal

Build the learner's mental model for how this training system should be used. The goal is not to memorize isolated answers. The goal is to improve how decisions are made under uncertainty.

## Key concepts

### Think in ranges

Players should not immediately lock an opponent onto one exact hand. Good poker decisions start by estimating a range of plausible hands and then narrowing that range as action unfolds.

What this means in practice:

- ask what kinds of hands a player can have, not what exact two cards they have
- use position and action history to shape the likely range
- update the range when new information appears

### Decision quality matters more than one result

A strong fold can lose no chips and feel boring. A strong bluff can get snapped. A bad call can get lucky. Training should reward good reasoning, not short-term emotional outcomes.

The platform should consistently reinforce this question:

- Was the decision good for the spot, given the information available?

### Context changes everything

An action that is sensible in one situation may be weak in another. The most important context variables for this product are:

- position
- stack depth
- action history
- board texture
- player type

### Memorization is useful but incomplete

Some memorization is helpful, especially for early preflop structure. It becomes a problem when the learner cannot explain why the answer changes.

Memorization without understanding usually breaks down when:

- stack sizes change
- the spot is slightly unusual
- an opponent has a specific tendency
- the hand reaches later streets

### Review is part of training

Improvement comes from repeated feedback and reflection. The learner should not only answer questions. The learner should also notice patterns in their mistakes and record lessons in hand review notes.

## Practical interpretation

A healthy learning loop for this product is:

1. Read the scenario carefully.
2. Identify the key context variables.
3. Estimate which ranges are involved.
4. Choose the action with the clearest purpose.
5. Compare the answer with the explanation.
6. Tag or remember the mistake pattern if the answer was wrong.
7. Revisit the concept later through more scenarios.

This is why the product is designed around scenario training instead of passive reference pages alone.

## Common mistakes

- assigning one exact hand too early
- saying a play was good only because the hand won
- using bets as "information probes" without a clear strategic purpose
- trying to memorize outputs without understanding the context inputs
- skipping review after mistakes
- treating simplified beginner rules as universal truths

## Examples of spots

### Example 1: Result versus decision quality

Hero 3-bets preflop with a strong value hand, gets called, and loses on a runout. The loss does not make the preflop 3-bet bad. The system should teach that the preflop choice can still be correct.

### Example 2: Range thinking

A cutoff open is called by the big blind. On a low coordinated flop, the cutoff should not assume the big blind has one exact draw. The big blind can have pairs, draws, two-pair combinations, sets, and floats.

### Example 3: Context dependence

Ace-jack offsuit may be a clear open from the button, a fold facing heavy action from early position, and a mixed or simplified fold in tighter beginner training spots. The hand label alone is not the whole decision.

## How this concept turns into training exercises

This handbook topic supports:

- range-thinking prompts inside preflop and postflop explanations
- answer feedback that separates decision quality from result orientation
- mistake tags such as `exact-hand-lock`, `result-oriented`, and `ignored-context`
- hand review notes that ask what information was available at decision time

Useful exercise types:

- scenario questions with two plausible lines and one better-context answer
- review prompts asking what ranges remain after an action sequence
- feedback blocks that compare a good process with a bad result-focused explanation

## Content mapping

Suggested tags:

- `learning-principles`
- `range-thinking`
- `decision-quality`
- `review-habit`
- `context-awareness`
- `training-method`
