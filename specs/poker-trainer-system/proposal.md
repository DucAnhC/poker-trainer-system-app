# Proposal: poker-trainer-system

## Project overview

`poker-trainer-system` is a web-based training platform for No-Limit Texas Hold'em. Its purpose is to help users make better decisions through structured, scenario-based learning with explanations, review loops, and progress tracking.

The product is intentionally more than a chart viewer. Static charts can help with memorizing common preflop spots, but they do not teach why decisions change with position, stack depth, action history, board texture, or opponent type. This system is meant to train applied poker thinking, not only recognition.

## User problem

Many poker learners face the same problems:

- They try to memorize isolated hands instead of understanding ranges.
- They judge themselves by whether a hand won or lost, not whether the decision was good.
- They over-focus on preflop charts and then feel lost on later streets.
- They lack a structured way to practice common decisions repeatedly.
- They struggle to connect theory, math, and opponent adjustment into one workflow.
- They review hands inconsistently and therefore repeat the same leaks.

Existing learning material is often fragmented across videos, charts, coaching notes, and forum posts. That makes it hard for learners to build a clean mental model or measure improvement over time.

## Why this product matters

Poker improvement is a decision-quality problem. Strong players do not simply know more hands; they interpret context better, understand why ranges interact with boards, and adapt more responsibly. A training platform that repeatedly asks the learner to choose an action, justify it, and review the logic behind it can close the gap between passive consumption and active skill building.

This matters especially for learners who want structure:

- beginners who need clean heuristics without being overwhelmed
- improving recreational players who want practical feedback
- self-directed grinders who want repeatable drills and progress visibility

## Product vision

Create a modular training system that teaches practical poker reasoning in layers:

1. Beginner heuristics that help users stop making the most costly mistakes.
2. Solid baseline strategy for common spots.
3. Controlled exploitative deviations based on player tendencies.

The platform should feel like a training environment rather than a static reference library. Users should repeatedly work through scenarios, receive concise educational feedback, tag recurring mistakes, and see which concepts need more attention.

## Target users

Primary users:

- beginner and low-stakes players who need structured fundamentals
- recreational players who want a practical improvement routine
- intermediate self-study players who want decision drills and review history

Secondary users:

- internal content authors or future coaches who may curate scenarios and explanations

Initial product assumptions for scope control:

- training is focused on self-study rather than multiplayer coaching
- early content uses six-max cash-game style assumptions unless a scenario states otherwise
- early training uses simplified but clearly labeled heuristics where needed

## Learning outcomes

After meaningful use of the MVP and early follow-on modules, a learner should improve at:

- recognizing that poker decisions are range-based, not single-hand guesses
- understanding why position and stack depth change preflop choices
- recognizing board texture and how it changes betting incentives
- using basic pot odds, outs, and equity intuition in practical spots
- adjusting to common player types without over-bluffing or over-calling
- separating the quality of a decision from the short-term hand result
- spotting recurring leaks through review and progress history

## Value proposition

The product combines practice, explanation, and reflection in one system.

Key value points:

- scenario-based training instead of passive reading
- context-rich questions instead of flat charts
- feedback that explains why, not only what
- modular training modes that can start simple and expand over time
- progress tracking tied to concepts, modules, and mistake patterns

For the learner, this creates a clearer path from "I saw the answer" to "I understand the decision."

## MVP scope

The MVP should be narrow enough to implement quickly but broad enough to prove the training model.

In scope for MVP:

- dashboard with entry points into training modules and recent progress summaries
- preflop trainer covering common open, call, 3-bet, 4-bet, and fold decisions
- pot odds quiz for basic math and practical call or fold decisions
- board texture quiz for recognizing dry, coordinated, paired, and draw-heavy boards
- player type exploit quiz for common population-style adjustments
- hand review notes for simple written reflection and leak tagging
- local-storage or mock persistence for progress history
- handbook content that supports the trainer modules

MVP content should prioritize:

- simple but realistic scenarios
- clean labels for simplifications
- immediate answer feedback
- reuse of shared scenario and explanation structures

## Non-goals

The following are intentionally out of scope for the initial product:

- real-money gameplay features
- hand importing from poker clients
- real-time HUD or live assistance
- full solver integration
- advanced multiway theory coverage
- tournament ICM modeling
- social community features
- coaching marketplace workflows
- complex auth and role management

These may become relevant later, but they should not distort the MVP.

## Future expansion ideas

Once the MVP proves the learning loop, the system can expand into:

- deeper postflop decision trees and multi-street scenario drills
- spaced repetition for recurring leaks and weak concepts
- richer hand review workflows with structured prompts
- tagged scenario libraries by stake, position, and spot family
- streaks, milestones, and habit-building progress loops
- coach-authored content packs
- database-backed persistence and analytics
- custom training plans by learner weakness
- tournament and short-stack modules
- range-comparison visualizations and combo-level breakdowns

## Constraints and assumptions

This planning phase assumes:

- the implementation stack will be Next.js, TypeScript, Tailwind CSS, and shadcn/ui
- the initial build should remain mock-data-first
- local persistence is sufficient for the MVP
- early scenarios may simplify poker strategy for teaching purposes, but every simplification must be labeled
- the first release should favor clarity and consistency over solver-level precision
- content and domain models should be designed so they can later migrate to a database without a rewrite of product concepts

Additional product assumptions:

- early scope should focus on six-max, single-opponent training spots more often than multiway complexity
- stack-depth buckets such as 20bb, 40bb, 60bb, and 100bb are acceptable MVP abstractions
- guidance should be educational and practical, not academic or bloated

## Success criteria for the planning phase

This proposal is successful if it keeps future implementation aligned around one idea:

The product exists to improve poker decision quality through structured, explainable training, not merely to display answers.
