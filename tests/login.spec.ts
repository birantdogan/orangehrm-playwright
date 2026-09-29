import { test, expect } from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashboardPage';
import { users } from '../test-data/users';

test.describe('Login and Logout Tests', () => {
  //test.describe.configure({ mode: 'serial' });

  // Log in successfully
  test('User should be able to login successfully @smoke', async ({ loginPage, page }) => {
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await expect(page).toHaveURL(/dashboard/);
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await expect(dashboardPage.quickLaunchTitle).toBeVisible();
  });

  // Login fails with invalid credentials
  test('User should not be able to login with invalid credentials @regression', async ({ loginPage, page }) => {
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password
    );

    await expect(loginPage.invalidCredentialsMessage).toBeVisible({
      timeout: 15000,
    });
  });

  // Log out successfully
  test('User should be able to logout successfully @regression', async ({ loginPage, page }) => {
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await loginPage.logout();

    await expect(loginPage.loginPageTitle).toBeVisible();
  });

  // Login fails with empty credentials
  test('User should not be able to login with empty credentials @regression', async ({ loginPage }) => {
    await loginPage.login(
      users.emptyUser.username,
      users.emptyUser.password
    );

    await expect(loginPage.usernameRequiredMessage).toBeVisible();
    await expect(loginPage.passwordRequiredMessage).toBeVisible();
  });

});