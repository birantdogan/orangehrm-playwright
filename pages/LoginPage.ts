import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly userDropdown: Locator;
  readonly loginPageTitle: Locator;
  readonly invalidCredentialsMessage: Locator;
  readonly usernameRequiredMessage: Locator;
  readonly passwordRequiredMessage: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });
    this.loginPageTitle = page.getByRole('heading', {
      name: 'Login',
    });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.invalidCredentialsMessage = page.getByText('Invalid credentials');
    this.usernameRequiredMessage = page
      .locator('.oxd-input-group')
      .filter({
        has: page.getByPlaceholder('Username'),
      })
      .getByText('Required');

    this.passwordRequiredMessage = page
      .locator('.oxd-input-group')
      .filter({
        has: page.getByPlaceholder('Password'),
      })
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.userDropdown.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
  }
}