import { test, expect } from '@playwright/test';

/**
 * Verification test for content drag fix
 * 
 * Root cause: SVG elements lacked drag prevention, causing browser's native
 * "ghost drag" behavior where content appears to move with cursor.
 * 
 * Fix: Added inline styles to empty state SVG and global CSS rule for all SVGs:
 * - CSS: svg { -webkit-user-drag: none; user-select: none; }
 * - Inline style on empty state icon SVG
 */

test.describe('Content Drag Prevention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/notes');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('Empty state: Dragging on the icon should not move content', async ({ page }) => {
    // Verify we're on empty state (no notes present)
    const emptyState = page.locator('text=Create your first note');
    await expect(emptyState).toBeVisible({ timeout: 5000 });

    // Locate the SVG icon in the empty state
    const iconContainer = page.locator('svg').first();
    await expect(iconContainer).toBeVisible();

    // Get the initial position of the icon container
    const initialBox = await iconContainer.boundingBox();
    expect(initialBox).not.toBeNull();

    // Attempt to drag the icon downward
    await iconContainer.hover();
    await page.mouse.down();
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y + 100  // Move 100px down
    );
    await page.mouse.up();

    // Verify the icon position hasn't changed
    const finalBox = await iconContainer.boundingBox();
    expect(finalBox).not.toBeNull();
    expect(finalBox!.y).toBeCloseTo(initialBox!.y, 5); // Allow 5px tolerance for floating point
    expect(finalBox!.x).toBeCloseTo(initialBox!.x, 5);
  });

  test('Empty state: Dragging on heading should not move content', async ({ page }) => {
    const heading = page.locator('text=/What|Capture|remember/').first();
    await expect(heading).toBeVisible({ timeout: 5000 });

    const initialBox = await heading.boundingBox();
    expect(initialBox).not.toBeNull();

    await heading.hover();
    await page.mouse.down();
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y + 100
    );
    await page.mouse.up();

    const finalBox = await heading.boundingBox();
    expect(finalBox!.y).toBeCloseTo(initialBox!.y, 5);
  });

  test('Empty state: Dragging on button should not move content', async ({ page }) => {
    const button = page.locator('button:has-text("Create your first note")');
    await expect(button).toBeVisible({ timeout: 5000 });

    const initialBox = await button.boundingBox();
    expect(initialBox).not.toBeNull();

    await button.hover();
    await page.mouse.down();
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2,
      initialBox!.y + 100
    );
    await page.mouse.up();

    const finalBox = await button.boundingBox();
    expect(finalBox!.y).toBeCloseTo(initialBox!.y, 5);
  });

  test('Empty state: Dragging on whitespace should not move content', async ({ page }) => {
    // Wait for empty state
    await expect(page.locator('text=Create your first note')).toBeVisible({ timeout: 5000 });

    // Get a reference element to track movement
    const heading = page.locator('text=/What|Capture|remember/').first();
    const initialBox = await heading.boundingBox();
    expect(initialBox).not.toBeNull();

    // Drag in empty whitespace area (to the right of the icon)
    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();
    
    const emptySpaceX = viewportSize!.width / 2 + 100;
    const emptySpaceY = viewportSize!.height / 2;

    await page.mouse.move(emptySpaceX, emptySpaceY);
    await page.mouse.down();
    await page.mouse.move(emptySpaceX, emptySpaceY + 100);
    await page.mouse.up();

    // Verify content didn't move
    const finalBox = await heading.boundingBox();
    expect(finalBox!.y).toBeCloseTo(initialBox!.y, 5);
  });

  test('With notes: Icons should not be draggable', async ({ page }) => {
    // Create a note first (if the empty state is showing)
    const createButton = page.locator('button:has-text("Create your first note")');
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForURL('**/notes/*');
      // Go back to list
      await page.goto('http://localhost:3001/notes');
      await page.waitForLoadState('networkidle');
    }

    // Try to drag any visible icon (Star, MoreHorizontal, etc from Lucide)
    // These should also be protected by the global CSS rule
    const icons = page.locator('svg').all();
    const iconsList = await icons;
    
    if (iconsList.length > 0) {
      const firstIcon = iconsList[0];
      const initialBox = await firstIcon.boundingBox();
      
      if (initialBox) {
        await firstIcon.hover();
        await page.mouse.down();
        await page.mouse.move(
          initialBox.x + initialBox.width / 2,
          initialBox.y + 50
        );
        await page.mouse.up();

        const finalBox = await firstIcon.boundingBox();
        if (finalBox) {
          expect(finalBox.y).toBeCloseTo(initialBox.y, 5);
        }
      }
    }
  });

  test('CSS rule verification: SVG elements have correct styles', async ({ page }) => {
    await expect(page.locator('text=Create your first note')).toBeVisible({ timeout: 5000 });
    
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check computed styles include drag prevention
    const userSelect = await svg.evaluate((el) => 
      window.getComputedStyle(el).userSelect
    );
    const webkitUserDrag = await svg.evaluate((el) => 
      window.getComputedStyle(el).getPropertyValue('-webkit-user-drag')
    );

    expect(userSelect).toBe('none');
    expect(webkitUserDrag).toBe('none');
  });
});
