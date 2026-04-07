const conceptLabelMap: Record<string, string> = {
  positions: "Position awareness",
  "opening-ranges": "Opening range discipline",
  "stack-depth": "Stack depth awareness",
  "vs-open": "Facing an open",
  domination: "Domination risk",
  "3betting": "3-bet structure",
  "pot-odds": "Pot odds",
  outs: "Outs counting",
  equity: "Equity intuition",
  "implied-odds": "Implied odds",
  "draw-discipline": "Draw discipline",
  "board-texture": "Board texture",
  "dry-board": "Dry-board recognition",
  "dynamic-board": "Dynamic-board caution",
  coordination: "Board coordination",
  "range-advantage": "Range advantage",
  "nut-advantage": "Nut advantage",
  cbetting: "C-bet discipline",
  "player-types": "Player-type adjustment",
  "baseline-vs-exploit": "Baseline versus exploit",
  "value-betting": "Value betting",
  "bluff-catching": "Bluff-catching discipline",
  postflop: "Postflop planning",
  "turn-barrel": "Turn barreling",
  "turn-play": "Turn discipline",
  "pot-control": "Pot control",
  "value-vs-bluff": "Value versus bluff",
  "one-pair-discipline": "One-pair discipline",
  discipline: "Discipline",
};

function titleCaseWord(word: string) {
  if (!word) {
    return "";
  }

  return word[0].toUpperCase() + word.slice(1);
}

function humanizeSlug(slug: string) {
  return slug
    .split(/[-_]/g)
    .map((word) => titleCaseWord(word))
    .join(" ");
}

export function getConceptLabel(conceptId: string) {
  return conceptLabelMap[conceptId] ?? humanizeSlug(conceptId);
}
