import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly dashboardTitle: Locator;
  readonly quickLaunchTitle: Locator;
  readonly pimMenu: Locator;

  constructor(private page: Page) {
    this.dashboardTitle = page.getByRole('heading', {
      name: 'Dashboard',
    });

    this.quickLaunchTitle = page.getByText('Quick Launch');

    this.pimMenu = page.getByRole('link', {
      name: 'PIM',
    });
  }

  async goToPIM() {
    await this.pimMenu.click();
  }
}
