import { test, expect } from '@playwright/test';

test.describe.skip('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/CMDCTR/);
    
    // Check for main content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation elements are present
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have working API endpoint', async ({ page }) => {
    // Test the API endpoint
    const response = await page.request.get('/api/test-status');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
  });
}); 