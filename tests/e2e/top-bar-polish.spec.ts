import { test, expect } from '@playwright/test';

test.describe('Top Bar Polish - Five Issues', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notes');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('ISSUE 1: Keyboard shortcut hint shows correct OS modifier', async ({ page, browserName }) => {
    // Find the search input keyboard shortcut hint
    const shortcutHint = page.locator('kbd').filter({ hasText: /K$/ });
    await expect(shortcutHint).toBeVisible();

    // Get the text content
    const hintText = await shortcutHint.textContent();

    // On Windows/Linux, should show "Ctrl K", on Mac should show "⌘K"
    // Playwright runs on the host OS, so we check based on that
    const platform = process.platform;
    if (platform === 'darwin') {
      expect(hintText).toBe('⌘K');
    } else {
      expect(hintText).toBe('Ctrl K');
    }
  });

  test('ISSUE 2: Sidebar Trash label is fully visible', async ({ page }) => {
    // Navigate to ensure sidebar is visible (desktop view)
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Find the Trash navigation item
    const trashButton = page.locator('button', { has: page.locator('svg + span', { hasText: 'Trash' }) });
    await expect(trashButton).toBeVisible();

    // Get the text content of the label
    const trashLabel = trashButton.locator('span', { hasText: 'Trash' });
    const labelText = await trashLabel.textContent();

    // Verify the full word "Trash" is present, not clipped like "...ash"
    expect(labelText).toBe('Trash');

    // Verify the element is not clipping by checking its dimensions
    const box = await trashLabel.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      // The label should have reasonable width (more than just "ash")
      expect(box.width).toBeGreaterThan(30);
    }
  });

  test('ISSUE 3: Top bar elements have consistent height alignment', async ({ page }) => {
    // Ensure desktop view
    await page.setViewportSize({ width: 1280, height: 720 });

    // Find the top bar elements
    const searchInput = page.locator('input[placeholder*="Search notes"]');
    const viewToggle = page.locator('[role="group"][aria-label="View mode"]');
    const newButton = page.locator('button', { hasText: '+ New' });

    await expect(searchInput).toBeVisible();
    await expect(viewToggle).toBeVisible();
    await expect(newButton).toBeVisible();

    // Get heights
    const searchBox = await searchInput.boundingBox();
    const toggleBox = await viewToggle.boundingBox();
    const buttonBox = await newButton.boundingBox();

    expect(searchBox).not.toBeNull();
    expect(toggleBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    if (searchBox && toggleBox && buttonBox) {
      // All should be h-7 (28px)
      expect(searchBox.height).toBe(28);
      expect(toggleBox.height).toBe(28);
      expect(buttonBox.height).toBe(28);

      // Verify vertical alignment (centers should be roughly aligned)
      const searchCenter = searchBox.y + searchBox.height / 2;
      const toggleCenter = toggleBox.y + toggleBox.height / 2;
      const buttonCenter = buttonBox.y + buttonBox.height / 2;

      // Allow 1px tolerance for rendering differences
      expect(Math.abs(searchCenter - toggleCenter)).toBeLessThan(1);
      expect(Math.abs(searchCenter - buttonCenter)).toBeLessThan(1);
    }
  });

  test('ISSUE 4: Double-click on search bar opens command palette', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search notes"]');
    await expect(searchInput).toBeVisible();

    // Single click should just focus the input (not open palette)
    await searchInput.click();
    await expect(page.locator('[data-testid="command-palette"]')).not.toBeVisible();

    // Blur the input
    await page.keyboard.press('Escape');

    // Double-click should open the command palette
    await searchInput.dblclick();
    await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();

    // Escape should close it
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="command-palette"]')).not.toBeVisible();

    // Verify keyboard shortcut still works
    await page.keyboard.press('Control+k');
    await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();
  });

  test('ISSUE 5: Note card options menu works correctly', async ({ page }) => {
    // Ensure we're in grid view where cards are visible
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for notes to load
    await page.waitForSelector('[role="button"][tabindex="0"]', { timeout: 5000 });

    // Find a note card (first one)
    const noteCard = page.locator('[role="button"][tabindex="0"]').first();
    await expect(noteCard).toBeVisible();

    // Hover over the card to make the "..." button visible
    await noteCard.hover();

    // Find and click the "..." button
    const moreButton = noteCard.locator('button[aria-label="More options"]');
    await expect(moreButton).toBeVisible({ timeout: 1000 });
    await moreButton.click();

    // Verify the dropdown menu appears
    const menu = page.locator('div').filter({ hasText: /^Open$/ }).first();
    await expect(menu).toBeVisible();

    // Verify menu items are present and clickable
    await expect(page.locator('button', { hasText: 'Open' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Duplicate' })).toBeVisible();
    await expect(page.locator('button', { hasText: /Pin|Unpin/ })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Move to Trash' })).toBeVisible();

    // Test keyboard accessibility - Escape should close the menu
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();

    // Reopen and test click-outside-to-close
    await noteCard.hover();
    await moreButton.click();
    await expect(menu).toBeVisible();

    // Click outside the menu
    await page.locator('header').click();
    await expect(menu).not.toBeVisible();
  });

  test('ISSUE 5: Note card menu actions execute correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForSelector('[role="button"][tabindex="0"]', { timeout: 5000 });

    const noteCard = page.locator('[role="button"][tabindex="0"]').first();
    await noteCard.hover();

    const moreButton = noteCard.locator('button[aria-label="More options"]');
    await moreButton.click();

    // Test "Open" action - should navigate or open the note
    const openButton = page.locator('button', { hasText: /^Open$/ }).first();
    await openButton.click();

    // After clicking Open, the menu should close
    await expect(page.locator('button', { hasText: /^Open$/ })).not.toBeVisible();

    // Verify we navigated or state changed (note opened)
    // This depends on app behavior - just verify menu closed for now
  });
});
