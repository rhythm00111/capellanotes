import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    // Capture console messages and page errors in tests via page.on('console')
    // and page.on('pageerror') — no config needed here.
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    // Re-use a server already running (e.g. from `pnpm dev` in another terminal)
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
