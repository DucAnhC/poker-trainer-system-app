# 02. Preflop Fundamentals

## Learning goal

Teach learners how position, action history, and stack depth shape preflop decisions. The aim is to move beyond memorizing one chart and toward understanding why opening, calling, 3-betting, 4-betting, or folding makes sense in context.

## Key concepts

### Positions matter

For the initial product scope, preflop training should mostly assume six-max positions:

- UTG
- HJ
- CO
- BTN
- SB
- BB

General pattern:

- earlier positions need stronger ranges because more players remain to act
- later positions can open wider because fewer players remain and position is stronger postflop
- the blinds are special because they often play with positional disadvantages or forced money in the pot

### Hand strength is contextual

A hand is not strong in a vacuum. Hand value changes based on:

- where hero sits
- who entered the pot first
- who may still act behind
- how deep the stacks are
- whether the decision is to open, call, 3-bet, or continue facing aggression

A suited connector on the button can be playable in a way that the same hand is not from early position. AJo can be a reasonable open in one seat and a dominated continue in another.

### Opening ranges are starting frameworks

Opening ranges help learners avoid entering too many bad hands from the wrong positions. In this product, opening guidance should be treated as a baseline framework, not a magic table that solves every game.

Good training questions should reinforce:

- tighter opens from early position
- wider opens from cutoff and button
- blind-specific adjustments
- stack-depth effects on which hands keep their value

### Calling versus 3-betting

When facing an open, the learner should think about why a hand prefers one action over another.

Questions to teach:

- Does the hand benefit from denying equity and building the pot?
- Is the hand strong enough to 3-bet for value?
- Is it a better bluff candidate than a flat call?
- Will calling create difficult dominated situations?
- Does stack depth support taking a flop?

This keeps the training focused on purpose, not random button pressing.

### 4-betting and folding to aggression

Learners often continue too far once they have already invested chips. The training system should normalize disciplined folds and clear value-driven continues. Not every decent hand survives more aggression.

### Stack depth effects

Stack depth changes which hands realize value well.

Broad training patterns:

- shallow stacks make raw equity and all-in thresholds matter more
- deeper stacks increase the value of hands that can make strong disguised hands
- some calls that look fine at 100bb become much weaker at 20bb

For MVP scope, stack-depth buckets such as 20bb, 40bb, 60bb, and 100bb are appropriate training simplifications.

## Practical interpretation

When a learner sees a preflop spot, the recommended process is:

1. Identify hero position and effective stack.
2. Identify whether the pot is unopened or whether there is prior aggression.
3. Estimate the likely opening or continuing range involved.
4. Decide which action has the clearest purpose.
5. Check whether the answer is a simplification, baseline recommendation, or exploit.

## Common mistakes

- opening too many weak offsuit hands from early position
- flat-calling hands that are dominated and hard to realize
- 3-betting without understanding whether the hand is value or bluff
- refusing to fold because chips are already invested
- ignoring how stack depth changes hand value
- treating one chart as correct for every lineup and stack size

## Examples of spots

### Example 1: Unopened cutoff spot

Hero is in the cutoff with a medium-strength suited Broadway hand at 100bb. This is often a comfortable open because position and stack depth support it.

### Example 2: Facing an early-position open

Hero is on the button with a hand that looks pretty but is often dominated by a tighter early-position range. The system may teach a fold or a very cautious continue depending on the training assumptions.

### Example 3: Small blind versus button open

Hero is in the small blind facing a wide button open. A hand that dislikes calling out of position may prefer a 3-bet-or-fold treatment in simplified training content.

## Common beginner simplifications

These are acceptable only when labeled clearly:

- treat some small blind spots as mostly 3-bet or fold to avoid weak out-of-position calls
- use stack-depth buckets instead of continuous stack modeling
- teach a narrower continuing range for beginners than an advanced baseline might use
- avoid limp-heavy preflop trees in the first teaching pass unless the module is explicitly about limp awareness

## How preflop spots can be trained

Useful training patterns:

- unopened open-or-fold drills by position
- versus-open decision drills with call, 3-bet, and fold options
- stack-depth comparison drills where the same hand changes action at 20bb versus 100bb
- explanation blocks that reference range advantage, domination risk, and playability
- mistake tags such as `opened-too-wide`, `dominated-call`, and `ignored-stack-depth`

## Content mapping

Suggested tags:

- `preflop`
- `positions`
- `opening-ranges`
- `3betting`
- `4betting`
- `stack-depth`
- `domination`
