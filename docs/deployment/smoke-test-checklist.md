# Smoke Test Checklist

Use this after a fresh production deploy or after any deploy that touches auth, persistence, or dashboard data flow.

## 1. App load

- Open `/`
- Confirm the home page renders without a crash
- Confirm navigation links render and route correctly

## 2. Dashboard load

- Open `/dashboard`
- Confirm the page renders in signed-out mode
- Confirm loading state appears briefly instead of a broken screen
- Confirm empty-state messaging is readable when no data exists

## 3. Sign up, sign in, and sign out

- Open `/auth`
- Create a new account with email and password
- Confirm redirect back into the app succeeds
- Sign out from header or settings
- Sign back in with the same credentials
- Confirm account mode messaging updates correctly

## 4. Account-backed persistence

- While signed in, complete at least one trainer question
- Refresh the page
- Confirm progress still appears on the dashboard
- Open another route and return to the dashboard
- Confirm progress remains available

## 5. Cloud progress read/write

- Run a short session in one interactive trainer
- Confirm attempts and recent session history update
- Confirm module totals or accuracy change after refresh

## 6. Review flow

- Open `/review`
- Save a new hand review note
- Confirm it appears in the note list
- Refresh the page
- Confirm it still exists while signed in
- Delete the note
- Confirm delete succeeds and the list updates cleanly

## 7. Settings and account tools

- Open `/settings`
- Confirm account mode, recent history, and local/cloud tools render
- If local browser data exists, confirm import/export/reset messaging is clear
- Confirm refresh controls work and do not crash the page

## 8. Session history

- Complete at least one short training run
- Confirm recent sessions appear on dashboard/settings
- Confirm timestamps and module labels look correct

## 9. Empty, loading, and error-state sanity checks

- Check a new signed-in account with no study data
- Confirm dashboard and settings show intentional empty states
- Confirm loading skeleton/state appears on page transitions
- If an account API request fails, confirm the app shows a readable issue instead of a blank screen

## 10. Persistence restart sanity check

- Restart the deployed app process
- Reopen the app and sign in again
- Confirm account-backed progress, sessions, and review notes still exist

## 11. Final release sanity check

- Confirm `NEXTAUTH_URL` matches the live public origin
- Confirm the deployed database path is persistent
- Confirm account mode feels clearly different from local-only mode
- Confirm no critical route returns a 500 during normal usage
