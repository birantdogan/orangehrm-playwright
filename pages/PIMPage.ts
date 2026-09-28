import { Page, Locator } from '@playwright/test';

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
        this.saveButton = page.locator('button').filter({
            hasText: 'Save',
        });
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
    }
    async goToAddEmployee() {
        await this.addButton.click();
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

}