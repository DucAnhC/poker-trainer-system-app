# 06. Common Beginner Leaks

## Learning goal

Identify recurring mistakes that the product should actively train against. This file is not just a warning list. It is a guide for how the system should tag wrong answers, write explanations, and build review loops.

## Key leaks

### Overvaluing one pair

Many beginners treat any top pair or overpair as a hand that should keep betting and calling automatically. The problem is that board texture, action strength, and player type can make one pair fragile.

Training correction:

- teach when one pair is a value hand, a bluff-catcher, or a hand that prefers pot control
- connect this leak to board texture and range thinking

### Calling too much

Beginners often hate folding because they are curious, attached to their hand, or worried about being bluffed. This leads to too many weak calls preflop and postflop.

Training correction:

- normalize disciplined folds
- explain price, domination, and under-bluffed lines
- separate curiosity from profitable calling

### Chasing bad draws

Draws feel exciting, so beginners often continue when the price is poor or the outs are not clean.

Training correction:

- use pot-odds and outs quizzes
- tag mistakes where the learner ignores price
- explain reverse implied odds when relevant

### Ignoring position

A hand that is playable in position may become awkward and dominated out of position. Beginners often focus only on the cards they hold.

Training correction:

- keep position visible in trainer screens
- show how the same hand can change action across seats

### Bluffing bad targets

Many learners bluff because they missed the board and do not want to give up. This leads to bluffing players who call too much or bluffing on boards that do not support the story.

Training correction:

- connect bluffing decisions to fold equity, range interaction, and player archetype
- teach that not every missed hand should bluff

### Not thinking in ranges

This is one of the biggest strategic leaks. Learners focus on hero's exact hand and villain's exact hand instead of the distribution of likely holdings.

Training correction:

- use explanations that mention both ranges
- ask what kinds of hands continue or fold in a line
- tag `exact-hand-lock` style mistakes

### Tilt and emotional leaks

Poor decisions often come from frustration, boredom, fear, or ego. While the product is not a mindset app, it should still encourage disciplined review habits.

Training correction:

- frame decision quality separately from recent outcomes
- encourage note-taking after confusing or emotional spots

### Poor hand review habits

Beginners often review only big pots or painful losses, and they do so without structure.

Training correction:

- guide notes toward situation, mistake, and lesson learned
- tie review to recurring leak tags

## Practical interpretation

The platform should use leaks as teaching anchors.

A wrong answer should not only say "incorrect." It should often say what type of mistake happened, such as:

- overvalued-one-pair
- ignored-position
- chased-bad-draw
- bluffed-bad-target
- result-oriented

This turns feedback into a reusable learning pattern.

## Examples of spots

### Example 1: Calling river aggression with one pair

Hero faces a strong river line from a passive opponent and calls because top pair feels too good to fold. The leak is not just a wrong river call. It is overvaluing one pair against a value-heavy line.

### Example 2: Calling a preflop open with dominated offsuit Broadways out of position

The learner may focus on the face cards and miss how poorly the hand realizes equity. This can map to both `calling-too-much` and `ignored-position`.

### Example 3: Bluffing a calling station on a draw-heavy board

The learner chooses an aggressive bluff because the hand has no showdown value, but the target is poor and the story is weak. This maps to `bluffed-bad-target`.

## How this concept turns into training exercises

Useful exercise patterns:

- wrong-answer feedback tied to one primary leak tag
- session summaries that surface repeated leaks
- hand review prompts asking the learner to name the leak in their own words
- dashboard callouts such as "Most common recent leak: ignored price"

## Content mapping

Suggested tags:

- `beginner-leaks`
- `one-pair-discipline`
- `calling-too-much`
- `draw-chasing`
- `position-awareness`
- `bad-bluff-targets`
- `range-thinking`
- `tilt-discipline`
- `review-habit`
