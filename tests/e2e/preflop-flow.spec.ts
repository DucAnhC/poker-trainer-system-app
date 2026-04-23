import { expect, test } from "@playwright/test";

import {
  expectActionStillSelected,
  installCleanTrainerState,
  openPreflopBeginnerDrill,
  selectActionByIndex,
  submitSelectedAction,
  trainerLocators,
} from "./helpers/trainer";

test.describe("Poker Trainer critical user flows", () => {
  test.beforeEach(async ({ page }) => {
    await installCleanTrainerState(page);
  });

  test("user can open the home page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Poker Trainer System/i);
    await expect(
      page.getByRole("link", { name: /Poker Trainer System/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: /Primary/i }),
    ).toBeVisible();
  });

  test("user can find where to start learning preflop", async ({ page }) => {
    await page.goto("/");

    const ui = trainerLocators(page);
    await expect(ui.homeStartPreflop).toBeVisible();

    await ui.homeStartPreflop.click();
    await expect(page).toHaveURL(/\/trainer\/preflop/);
    await expect(ui.sessionStrip).toBeVisible();
    await expect(ui.questionTitle).toBeVisible();
  });

  test("user can select an answer and the choice does not reset after click", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    const selectedAction = await selectActionByIndex(page, 0);

    await expect(ui.selectedLineSummary).toContainText(/Open/i);
    await expect(ui.primaryAction).toBeEnabled();

    // Guard the common regression where a parent re-render clears selectedActionId.
    await page.waitForTimeout(1000);
    await expectActionStillSelected(selectedAction);
    await expect(ui.selectedLineSummary).toContainText(/Open/i);
  });

  test("submitting a correct preflop answer shows clear feedback and updates status", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    await selectActionByIndex(page, 0);
    await submitSelectedAction(page);

    await expect(ui.feedbackPanel).toContainText(/Đúng|Correct/);
    await expect(ui.feedbackPanel).toContainText(/Line chuẩn|Best line/);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAccuracy).toContainText("100%");
    await expect(ui.sessionAttempts).toContainText("1");
  });

  test("double-clicking submit reveals feedback without advancing to the next question", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    const firstQuestion = (await ui.questionTitle.textContent())?.trim();
    expect(firstQuestion).toBeTruthy();

    await selectActionByIndex(page, 0);
    await expect(ui.primaryAction).toBeEnabled();
    await ui.primaryAction.dblclick();

    await expect(ui.feedbackPanel).toHaveAttribute("data-state", "revealed");
    await expect(ui.feedbackPanel).toContainText(/Đúng|Correct/);
    await expect(ui.questionTitle).toHaveText(firstQuestion as string);
    await expect(ui.primaryAction).toContainText(/Tình huống tiếp|Next spot/);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAttempts).toContainText("1");
  });

  test("submitting an incorrect preflop answer shows wrong feedback and the recommended line", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    await selectActionByIndex(page, 1);
    await submitSelectedAction(page);

    await expect(ui.feedbackPanel).toContainText(/Sai|Incorrect/);
    await expect(ui.feedbackPanel).toContainText(/Line chuẩn|Best line/);
    await expect(ui.feedbackPanel).toContainText(/Open/i);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAccuracy).toContainText("0%");
  });

  test("double-clicking next advances only one question", async ({ page }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    const firstQuestion = (await ui.questionTitle.textContent())?.trim();
    expect(firstQuestion).toBeTruthy();

    await selectActionByIndex(page, 0);
    await submitSelectedAction(page);
    await expect(ui.primaryAction).toContainText(/Tình huống tiếp|Next spot/);

    await ui.primaryAction.dblclick();

    await expect(ui.questionTitle).not.toHaveText(firstQuestion as string);
    await expect(ui.questionTitle).toContainText(/KJs/);
    await expect(ui.feedbackPanel).toHaveAttribute("data-state", "waiting");
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAttempts).toContainText("1");
  });

  test("retrying the same spot adds attempts without advancing visible progress", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    const firstQuestion = (await ui.questionTitle.textContent())?.trim();
    expect(firstQuestion).toBeTruthy();

    await selectActionByIndex(page, 1);
    await submitSelectedAction(page);
    await expect(ui.feedbackPanel).toContainText(/Sai|Incorrect/);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAccuracy).toContainText("0%");
    await expect(ui.sessionAttempts).toContainText("1");

    await expect(ui.tertiaryAction).toBeEnabled();
    await ui.tertiaryAction.click();

    await expect(ui.questionTitle).toHaveText(firstQuestion as string);
    await expect(ui.feedbackPanel).toHaveAttribute("data-state", "waiting");
    await expect(ui.selectedLineSummary).toContainText(
      /Chưa chọn line|No line selected/,
    );
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAttempts).toContainText("1");

    await selectActionByIndex(page, 0);
    await submitSelectedAction(page);

    await expect(ui.questionTitle).toHaveText(firstQuestion as string);
    await expect(ui.feedbackPanel).toContainText(/Đúng|Correct/);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAccuracy).toContainText("100%");
    await expect(ui.sessionAttempts).toContainText("2");
  });

  test("user can move to the next question and the next question actually changes", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    const ui = trainerLocators(page);
    const firstQuestion = (await ui.questionTitle.textContent())?.trim();
    expect(firstQuestion).toBeTruthy();

    await selectActionByIndex(page, 0);
    await submitSelectedAction(page);

    await expect(ui.primaryAction).toContainText(/Tình huống tiếp|Next spot/);
    await ui.primaryAction.click();

    await expect(ui.questionTitle).not.toHaveText(firstQuestion as string);
    await expect(ui.questionTitle).toContainText(/KJs/);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.selectedLineSummary).toContainText(
      /Chưa chọn line|No line selected/,
    );
  });

  test("refresh after reveal resets transient UI while preserving saved attempts", async ({
    page,
  }) => {
    await openPreflopBeginnerDrill(page);

    await selectActionByIndex(page, 0);
    await submitSelectedAction(page);

    const uiBeforeReload = trainerLocators(page);
    await expect(uiBeforeReload.feedbackPanel).toContainText(/Đúng|Correct/);
    await expect(uiBeforeReload.sessionProgress).toContainText("1/2");
    await expect(uiBeforeReload.sessionAttempts).toContainText("1");

    await page.reload();

    const ui = trainerLocators(page);
    await expect(ui.sessionStrip).toBeVisible();
    await expect(ui.questionTitle).toBeVisible();
    await expect(ui.feedbackPanel).toHaveAttribute("data-state", "waiting");
    await expect(ui.selectedLineSummary).toContainText(
      /Chưa chọn line|No line selected/,
    );
    await expect(ui.sessionProgress).toContainText("0/2");
    await expect(ui.sessionAttempts).toContainText("1");

    // The active reveal is intentionally not rehydrated yet, but the flow must stay coherent.
    await selectActionByIndex(page, 0);
    await submitSelectedAction(page);
    await expect(ui.feedbackPanel).toContainText(/Đúng|Correct/);
    await expect(ui.sessionProgress).toContainText("1/2");
    await expect(ui.sessionAttempts).toContainText("2");
  });
});
