import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check that the main heading is visible
  await expect(
    page.getByRole('heading', { name: '🎭 PokerVibes' })
  ).toBeVisible();

  // Check that the buttons are present
  await expect(
    page.getByRole('button', { name: 'Start a Session' })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Join a Session' })
  ).toBeVisible();

  // Check that the feature cards are present
  await expect(page.getByText('Estimate Stories')).toBeVisible();
  await expect(page.getByText('Team Collaboration')).toBeVisible();
  await expect(page.getByText('Consensus Building')).toBeVisible();
});
