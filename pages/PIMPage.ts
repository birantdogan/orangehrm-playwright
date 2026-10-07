import { Page, Locator, expect } from '@playwright/test';

export class PIMPage {
    readonly pimTitle: Locator;
    readonly addButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly saveButton: Locator;
    readonly successToast: Locator;
    readonly personalDetailsTitle: Locator;
    readonly employeeIdAlreadyExistsMessage: Locator;
    readonly searchButton: Locator;
    readonly employeeCards: Locator;
    readonly personalDetailsEmployeeIdInput: Locator;
    readonly deleteConfirmationDialog: Locator;
    readonly confirmDeleteButton: Locator;

    constructor(private page: Page) {
        this.pimTitle = page.getByRole('heading', {
            name: 'PIM',
        });
        this.addButton = page.locator('button').filter({
            hasText: 'Add',
        });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.employeeIdInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Employee Id', { exact: true }),
            })
            .locator('input');
        this.saveButton = page
            .locator('form')
            .filter({
                has: page.getByPlaceholder('First Name'),
            })
            .getByRole('button', { name: 'Save' });
        this.successToast = page.locator('.oxd-toast--success');
        this.personalDetailsTitle = page.getByRole('heading', {
            name: 'Personal Details',
        });
        this.employeeIdAlreadyExistsMessage = page.getByText(
            'Employee Id already exists',
            { exact: true }
        );
        this.searchButton = page.locator('button').filter({
            hasText: 'Search',
        });
        this.employeeCards = page.locator('.oxd-table-card');
        this.personalDetailsEmployeeIdInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Employee Id', { exact: true }),
            })
            .locator('input');
        this.deleteConfirmationDialog = page.getByRole('document').filter({
            hasText: 'Are you Sure?',
        });

        this.confirmDeleteButton = this.deleteConfirmationDialog.getByRole('button', {
            name: 'Yes, Delete',
        });
    }
    async goToAddEmployee() {
        await this.addButton.click();
    }
    async goToEmployeeList() {
        await this.page.getByText('Employee List', { exact: true }).click();
    }
    async fillFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }
    async fillLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }
    async fillEmployeeId(employeeId: string) {
        await this.employeeIdInput.fill(employeeId);
    }
    async saveEmployee() {
        await this.saveButton.click();
    }
    async searchEmployeeById(employeeId: string) {
        await this.employeeIdInput.fill(employeeId);
        await this.searchButton.click();

        return this.page
            .locator('.oxd-table-row')
            .filter({
                has: this.page.getByText(employeeId, { exact: true }),
            })
            .getByText(employeeId, { exact: true });
    }
    getEmployeeRowById(employeeId: string) {
        return this.page
            .locator('.oxd-table-row')
            .filter({
                has: this.page.getByText(employeeId, { exact: true }),
            });
    }
    async deleteEmployee(employeeId: string) {
        const employeeRow = this.getEmployeeRowById(employeeId);

        await employeeRow
            .locator('button')
            .filter({
                has: this.page.locator('.bi-trash'),
            })
            .click();

        await expect(
            this.deleteConfirmationDialog.getByText('Are you Sure?', {
                exact: true,
            })
        ).toBeVisible();

        await this.confirmDeleteButton.click();

        await expect(this.successToast)
            .toContainText('Successfully Deleted');
    }
    async getFirstEmployeeId() {
        return this.employeeCards
            .nth(0)
            .getByRole('cell')
            .nth(1)
            .innerText();
    }
    async getFirstEmployeeDetails() {
        const employeeCard = this.employeeCards.nth(0);

        return {
            employeeId: await employeeCard.getByRole('cell').nth(1).innerText(),
            firstName: await employeeCard.getByRole('cell').nth(2).innerText(),
            lastName: await employeeCard.getByRole('cell').nth(3).innerText(),
        };
    }
    async openFirstEmployeeDetails() {
        await this.employeeCards
            .nth(0)
            .click();
    }
}
