import { expect, type Locator, type Page } from "@playwright/test";

export const preflopBeginnerRoute =
  "/trainer/preflop?pack=preflop-position-basics&difficulty=beginner";

export async function installCleanTrainerState(page: Page) {
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem("poker-trainer-test-state-ready")) {
      window.localStorage.clear();
      window.sessionStorage.setItem("poker-trainer-test-state-ready", "1");
    }

    window.localStorage.setItem("poker-trainer-ui-language", "vi");
  });
}

export function trainerLocators(page: Page) {
  return {
    actionOptions: page.getByTestId("trainer-action-option"),
    feedbackPanel: page.getByTestId("preflop-feedback-panel"),
    homeStartPreflop: page.getByTestId("home-start-preflop"),
    primaryAction: page.getByTestId("trainer-primary-action"),
    questionCard: page.getByTestId("preflop-question-card"),
    questionTitle: page.getByTestId("preflop-question-title"),
    selectedLineSummary: page.getByTestId("selected-line-summary"),
    sessionAccuracy: page.getByTestId("preflop-session-accuracy"),
    sessionAttempts: page.getByTestId("preflop-session-attempts"),
    sessionProgress: page.getByTestId("preflop-session-progress"),
    sessionStrip: page.getByTestId("preflop-session-strip"),
    tertiaryAction: page.getByTestId("trainer-tertiary-action"),
  };
}

export async function openPreflopBeginnerDrill(page: Page) {
  await page.goto(preflopBeginnerRoute);

  const ui = trainerLocators(page);
  await expect(ui.sessionStrip).toBeVisible();
  await expect(ui.questionCard).toBeVisible();
  await expect(ui.questionTitle).toBeVisible();
  await expect(ui.sessionProgress).toContainText("0/2");
}

export async function selectActionByIndex(page: Page, index: number) {
  const action = trainerLocators(page).actionOptions.nth(index);

  await action.click();
  await expect(action).toHaveAttribute("aria-pressed", "true");

  return action;
}

export async function submitSelectedAction(page: Page) {
  const ui = trainerLocators(page);

  await expect(ui.primaryAction).toBeEnabled();
  await ui.primaryAction.click();
  await expect(ui.feedbackPanel).toHaveAttribute("data-state", "revealed");
}

export async function expectActionStillSelected(action: Locator) {
  await expect(action).toHaveAttribute("aria-pressed", "true");
}
