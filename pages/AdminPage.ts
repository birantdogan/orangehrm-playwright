import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
    readonly adminTitle: Locator;
    readonly userRows: Locator;
    readonly usernameInput: Locator;
    readonly searchButton: Locator;
    readonly userRoleSelect: Locator;
    readonly statusSelect: Locator;
    readonly editButtons: Locator;

    readonly addButton: Locator;
    readonly addUserTitle: Locator;
    readonly addUserRoleSelect: Locator;
    readonly addEmployeeNameInput: Locator;
    readonly addStatusSelect: Locator;
    readonly addUsernameInput: Locator;
    readonly addPasswordInput: Locator;
    readonly addConfirmPasswordInput: Locator;
    readonly saveButton: Locator;

    constructor(private page: Page) {
        this.adminTitle = page.getByRole('heading', {
            name: 'Admin',
        });

        this.userRows = page.locator('.oxd-table-row');

        this.usernameInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Username', { exact: true }),
            })
            .locator('input');

        this.searchButton = page.getByRole('button', {
            name: 'Search',
            exact: true,
        });

        this.userRoleSelect = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('User Role', { exact: true }),
            })
            .locator('.oxd-select-text-input');

        this.statusSelect = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Status', { exact: true }),
            })
            .locator('.oxd-select-text-input');

        this.editButtons = page.locator('.oxd-icon.bi-pencil-fill');

        this.addButton = page.locator(
            '.orangehrm-header-container button'
        );

        this.addUserTitle = page.getByRole('heading', {
            name: 'Add User',
        });

        this.addUserRoleSelect = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('User Role', { exact: true }),
            })
            .locator('.oxd-select-text-input');

        this.addEmployeeNameInput = page.getByPlaceholder('Type for hints...');

        this.addStatusSelect = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Status', { exact: true }),
            })
            .locator('.oxd-select-text-input');

        this.addUsernameInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Username', { exact: true }),
            })
            .locator('input');

        this.addPasswordInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Password', { exact: true }),
            })
            .locator('input');

        this.addConfirmPasswordInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Confirm Password', { exact: true }),
            })
            .locator('input');

        this.saveButton = page.getByRole('button', {
            name: 'Save',
            exact: true,
        });
    }
    async selectEmployee(searchText: string) {
        await this.addEmployeeNameInput.fill(searchText);

        const options = this.page.locator('.oxd-autocomplete-option');

        await expect(options.first()).toBeVisible();

        await expect(options.first()).not.toHaveText('Searching....');

        await options.first().click();
    }
    async goToUsers() {
        await this.page
            .getByRole('navigation', { name: 'Topbar Menu' })
            .getByText('User Management', { exact: true })
            .click();

        await this.page.getByText('Users', { exact: true }).click();
    }
}