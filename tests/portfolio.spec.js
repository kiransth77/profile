import { test, expect } from '@playwright/test';

test.describe('Portfolio Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main sections', async ({ page }) => {
    // Check if all main sections are present
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    const navLinks = page.locator('nav .hidden.md\\:flex a');
    await expect(navLinks).toHaveCount(5);
    
    // Click on About link
    await page.click('nav a[href="#about"]');
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Verify we scrolled to About section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should display hero section content', async ({ page }) => {
    const heroName = page.locator('#hero-name');
    const heroTitle = page.locator('#hero-title');
    
    await expect(heroName).toContainText('Kiran Shrestha');
    await expect(heroTitle).toContainText('Full Stack Developer');
  });

  test('should display about section content', async ({ page }) => {
    // Scroll to about section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Check if about section content is visible
    const aboutSection = page.locator('#about');
    await expect(aboutSection.locator('h2')).toContainText('About Me');
    
    // Check for profile card
    const profileCard = aboutSection.locator('.scroll-slide-left');
    await expect(profileCard).toBeVisible({ timeout: 2000 });
    
    // Check for description
    const description = aboutSection.locator('.scroll-slide-right');
    await expect(description).toBeVisible({ timeout: 2000 });
  });

  test('should animate elements on scroll', async ({ page }) => {
    // Check initial state - elements should be hidden (opacity 0)
    const aboutTitle = page.locator('#about h2.scroll-fade-in');
    
    // Scroll to trigger animation
    await aboutTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Wait for animation
    
    // Element should be visible after animation
    await expect(aboutTitle).toBeVisible();
  });

  test('should load and display skills', async ({ page }) => {
    // Scroll to skills section
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    const skillsContainer = page.locator('#skills-container');
    await expect(skillsContainer).toBeVisible();
    
    // Should have skill cards
    const skillCards = skillsContainer.locator('.card-hover');
    await expect(skillCards.first()).toBeVisible({ timeout: 2000 });
  });

  test('should load GitHub projects', async ({ page }) => {
    // Scroll to projects section
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const loadButton = page.locator('#load-github-projects');
    await expect(loadButton).toBeVisible();
    
    // Click load projects button
    await loadButton.click();
    
    // Wait for loading indicator
    const loadingIndicator = page.locator('#projects-loading');
    await expect(loadingIndicator).toBeVisible();
    
    // Wait for projects to load (max 10 seconds)
    await page.waitForTimeout(3000);
    
    // Projects should be displayed
    const projectsContainer = page.locator('#projects-container');
    const projectCards = projectsContainer.locator('.card-hover');
    
    // Should have at least one project
    await expect(projectCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should have accessibility attributes', async ({ page }) => {
    // Check for aria-labels on social links
    const githubLink = page.locator('nav a[aria-label*="GitHub"]').first();
    await expect(githubLink).toHaveAttribute('aria-label');
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check for aria-hidden on icons
    const icons = page.locator('i[aria-hidden="true"]');
    await expect(icons.first()).toHaveAttribute('aria-hidden', 'true');
  });

  test('should handle contact form', async ({ page }) => {
    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const form = page.locator('#contact form');
    await expect(form).toBeVisible();
    
    // Check form has proper labels
    await expect(form.locator('label[for="name"]')).toBeVisible();
    await expect(form.locator('label[for="email"]')).toBeVisible();
    await expect(form.locator('label[for="message"]')).toBeVisible();
  });

  test('should have GSAP animations working', async ({ page }) => {
    // Wait for GSAP to load
    await page.waitForTimeout(500);
    
    // Check if GSAP is loaded
    const gsapLoaded = await page.evaluate(() => {
      return typeof window.gsap !== 'undefined';
    });
    expect(gsapLoaded).toBe(true);
    
    // Check if ScrollTrigger is loaded
    const scrollTriggerLoaded = await page.evaluate(() => {
      return typeof window.ScrollTrigger !== 'undefined';
    });
    expect(scrollTriggerLoaded).toBe(true);
  });
});
