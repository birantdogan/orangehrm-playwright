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
    readonly editUserTitle: Locator;
    readonly editUsernameInput: Locator;

    constructor(private page: Page) {
        this.adminTitle = page.getByRole('heading', {
            name: 'Admin',
        });

        this.userRows = page.getByRole('row').filter({
            has: page.getByRole('cell'),
        });

        this.usernameInput = page.locator(
            'xpath=//label[normalize-space()="Username"]/../following-sibling::div//input'
        );

        this.searchButton = page.getByRole('button', {
            name: 'Search',
            exact: true,
        });

        this.userRoleSelect = page.locator(
            'xpath=//label[normalize-space()="User Role"]/../following-sibling::div//div[@tabindex="0"]'
        );

        this.statusSelect = page.locator(
            'xpath=//label[normalize-space()="Status"]/../following-sibling::div//div[@tabindex="0"]'
        );

        this.editButtons = page.locator('button').filter({
            has: page.locator('[class*="pencil"]'),
        });

        this.addButton = page.locator('button').filter({
            hasText: 'Add',
        });

        this.addUserTitle = page.getByRole('heading', {
            name: 'Add User',
        });

        this.addUserRoleSelect = page.locator(
            'xpath=//label[normalize-space()="User Role"]/../following-sibling::div//div[@tabindex="0"]'
        );

        this.addEmployeeNameInput = page.getByPlaceholder('Type for hints...');

        this.addStatusSelect = page.locator(
            'xpath=//label[normalize-space()="Status"]/../following-sibling::div//div[@tabindex="0"]'
        );

        this.addUsernameInput = page.locator(
            'xpath=//label[normalize-space()="Username"]/../following-sibling::div//input'
        );

        this.addPasswordInput = page.locator(
            'xpath=//label[normalize-space()="Password"]/../following-sibling::div//input[@type="password"]'
        );

        this.addConfirmPasswordInput = page.locator(
            'xpath=//label[normalize-space()="Confirm Password"]/../following-sibling::div//input[@type="password"]'
        );

        this.saveButton = page.getByRole('button', {
            name: 'Save',
            exact: true,
        });

        this.editUserTitle = page.getByRole('heading', {
            name: 'Edit User',
        });

        this.editUsernameInput = page.locator(
            'xpath=//label[normalize-space()="Username"]/../following-sibling::div//input'
        );
    }
    async selectEmployee(searchText: string) {
        await this.addEmployeeNameInput.fill(searchText);

        const employeeOption = this.page
            .getByRole('listbox')
            .getByRole('option')
            .filter({
                hasNotText: 'Searching....',
            })
            .first();

        await expect(employeeOption).toBeVisible({
            timeout: 15000,
        });

        await employeeOption.click();
    }
    async fillUserForm(username: string, password: string) {
        await this.addUserRoleSelect.click();
        await this.page.getByRole('option', {
            name: 'ESS',
            exact: true,
        }).click();

        await this.selectEmployee('a');

        await this.addStatusSelect.click();
        await this.page.getByRole('option', {
            name: 'Enabled',
            exact: true,
        }).click();

        await this.addUsernameInput.fill(username);
        await this.addPasswordInput.fill(password);
        await this.addConfirmPasswordInput.fill(password);
    }
    async createUser(username: string, password: string) {
        await this.addButton.click();

        await this.fillUserForm(username, password);

        await this.saveButton.click();
    }
    async goToUsers() {
        await this.page
            .getByRole('navigation', { name: 'Topbar Menu' })
            .getByText('User Management', { exact: true })
            .click();

        await this.page.getByText('Users', { exact: true }).click();
    }
    async deleteUser(username: string) {
        await this.usernameInput.fill(username);
        await expect(this.usernameInput).toHaveValue(username);
        await this.searchButton.click();

        const userRow = this.userRows.filter({
            hasText: username,
        });

        await expect(userRow).toBeVisible();

        await userRow.locator('button').filter({
            has: this.page.locator('[class*="trash"]'),
        }).click();

        const deleteDialog = this.page.getByRole('dialog');

        await expect(deleteDialog).toBeVisible();

        await deleteDialog
            .getByRole('button', { name: 'Yes, Delete' })
            .click();
    }
}