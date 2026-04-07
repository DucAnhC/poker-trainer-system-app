type TrainerControlsProps = {
  canSubmit: boolean;
  hasSubmitted: boolean;
  isLastScenario: boolean;
  isComplete: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
};

export function TrainerControls({
  canSubmit,
  hasSubmitted,
  isLastScenario,
  isComplete,
  onSubmit,
  onNext,
  onRestart,
}: TrainerControlsProps) {
  if (isComplete) {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
        >
          Restart session
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {!hasSubmitted ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:bg-muted-foreground/40"
        >
          Submit answer
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
        >
          {isLastScenario ? "Finish session" : "Next scenario"}
        </button>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
      >
        Restart
      </button>
    </div>
  );
}
