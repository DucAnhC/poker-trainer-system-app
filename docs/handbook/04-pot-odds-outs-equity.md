# 04. Pot Odds, Outs, and Equity

## Learning goal

Teach learners the practical math needed to make better call, fold, and draw decisions without turning the product into a math textbook. The target is usable intuition: enough accuracy to improve decisions in common spots.

## Key concepts

### Pot odds

Pot odds describe the price a player is getting to continue.

A practical learner question is:

- How often do I need to win for this call to break even?

For the training system, pot-odds exercises should usually present:

- current pot size
- amount to call
- simplified decision options

### Outs

Outs are cards that can improve a hand to something meaningfully stronger. Counting outs teaches learners to connect draws with decision quality.

The system should also teach caution:

- not all outs are clean
- some outs can still leave the learner second-best
- rough counting is useful, but overcounting is a common leak

### Rough equity intuition

The learner does not need exact solver output to improve. They do need a basic feel for whether a draw or made hand has enough equity against the likely range and price being offered.

Useful intuition-building ideas:

- strong draws often have more equity than beginners expect
- weak pairs against pressure often have less equity than they hope
- a call can be wrong even when a draw has many outs if the price is bad

### Implied odds

Implied odds matter when future money can make a current call profitable. For beginner training, this should be taught carefully and not as an excuse to chase every draw.

The product should reinforce:

- implied odds help more when stacks are deeper
- implied odds shrink when the opponent will not pay enough on later streets
- reverse implied odds can punish dominated hands and weak draws

### Basic drawing math

The product does not need advanced combinatorics in the MVP. It does need useful shortcuts and repeated application.

Acceptable beginner-friendly methods:

- rough outs counting
- quick call-or-fold comparisons based on price
- simple turn-or-river approximation rules when clearly labeled as approximations

## Practical interpretation

A learner-facing math checklist is:

1. What is the price to call?
2. How many realistic outs do I have?
3. Are those outs clean or dirty?
4. Is this a pure immediate-price call, or am I relying on implied odds?
5. Does the likely range make my draw or made hand weaker than it first appears?

## Common mistakes

- calling without knowing the price
- counting too many outs
- assuming all draws are profitable because they feel "live"
- ignoring reverse implied odds
- using implied odds as a vague excuse instead of a real consideration
- making math decisions based only on hope or frustration

## Examples of spots

### Example 1: Flush draw facing a flop bet

Hero faces a bet with a clean flush draw and reasonable price. The training question may ask whether the immediate pot odds and draw strength justify a call.

### Example 2: Gutshot with poor price

Hero has only a weak draw facing a large turn bet. The product should teach that not all draws are worth continuing with, especially when the price is poor and implied odds are limited.

### Example 3: Dominated top pair facing heavy action

Even made hands need equity thinking. A one-pair hand may feel strong, but against a narrow value-heavy range it can perform badly despite already being made.

## How this concept turns into training exercises

Useful exercise types:

- pot size and call size multiple-choice quizzes
- outs-counting drills
- clean-outs versus dirty-outs identification
- call-or-fold scenarios that mention implied odds explicitly
- mistake tags such as `ignored-price`, `overcounted-outs`, and `chased-bad-draw`

The explanation should always connect the math back to a real decision, not just a formula.

## Content mapping

Suggested tags:

- `pot-odds`
- `outs`
- `equity`
- `implied-odds`
- `drawing-math`
- `math-discipline`
