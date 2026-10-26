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

        this.employeeIdInput = page.locator(
            'xpath=//label[normalize-space()="Employee Id"]/../following-sibling::div//input'
        );

        this.saveButton = page
            .locator('form')
            .filter({
                has: page.getByPlaceholder('First Name'),
            })
            .getByRole('button', { name: 'Save' });

        this.successToast = page.locator('[aria-live="assertive"]').filter({
            hasText: 'Success',
        });

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

        this.employeeCards = page.getByRole('row').filter({
            has: page.getByRole('cell'),
        });

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
    async fillField(field: Locator, value: string) {
        await field.fill(value);
    }
    async saveEmployee() {
        const formLoader = this.page.locator('.oxd-form-loader');

        // Wait until the form loading overlay disappears
        await expect(formLoader).toBeHidden({ timeout: 15000 });

        // Save the employee
        await expect(this.saveButton).toBeEnabled();
        await this.saveButton.click();
    }
    async searchEmployeeById(employeeId: string) {
        await this.employeeIdInput.fill(employeeId);
        await this.searchButton.click();

        const employeeIdCell = this.getEmployeeRowById(employeeId)
            .getByRole('cell', {
                name: employeeId,
                exact: true,
            });

        await expect(employeeIdCell).toBeVisible({
            timeout: 15000,
        });

        return employeeIdCell;
    }
    getEmployeeRowById(employeeId: string) {
        return this.employeeCards.filter({
            has: this.page.getByRole('cell', {
                name: employeeId,
                exact: true,
            }),
        });
    }
    async deleteEmployee(employeeId: string) {
        const employeeRow = this.getEmployeeRowById(employeeId);

        await employeeRow
            .getByRole('button')
            .filter({
                has: this.page.locator('i.bi-trash'),
            })
            .click();

        await expect(
            this.deleteConfirmationDialog.getByText('Are you Sure?', {
                exact: true,
            })
        ).toBeVisible();

        await this.confirmDeleteButton.click();

        // Verify employee is removed from the list
        await expect(employeeRow).toHaveCount(0);
    }
    async getFirstEmployeeId() {
        await expect(this.employeeCards.first()).toBeVisible();

        const employeeCount = await this.employeeCards.count();

        for (let i = 0; i < employeeCount; i++) {
            const employeeId = (
                await this.employeeCards
                    .nth(i)
                    .getByRole('cell')
                    .nth(1)
                    .innerText()
            ).trim();

            if (employeeId) {
                return employeeId;
            }
        }

        throw new Error('No employee with a valid Employee ID was found');
    }
    async getFirstEmployeeDetails() {
        await expect(this.employeeCards.first()).toBeVisible();

        const employeeCount = await this.employeeCards.count();

        for (let i = 0; i < employeeCount; i++) {
            const employeeCard = this.employeeCards.nth(i);

            const employeeId = (
                await employeeCard.getByRole('cell').nth(1).innerText()
            ).trim();

            if (employeeId) {
                return {
                    employeeId,
                    firstName: (
                        await employeeCard.getByRole('cell').nth(2).innerText()
                    ).trim(),
                    lastName: (
                        await employeeCard.getByRole('cell').nth(3).innerText()
                    ).trim(),
                };
            }
        }

        throw new Error('No employee with a valid Employee ID was found');
    }
    async openFirstEmployeeDetails(employeeId: string) {
        const employeeRow = this.getEmployeeRowById(employeeId);

        await expect(employeeRow).toBeVisible();
        await employeeRow.click();
    }
}
