import { test, expect } from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashboardPage';
import { users } from '../test-data/users';
import { PIMPage } from '../pages/PIMPage';
import { generateEmployeeId } from '../utils/testData';

test.describe('PIM Tests', () => {

    // Create a new employee successfully
    test('User should be able to create a new employee @smoke', async ({ loginPage, page }) => {

        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await dashboardPage.goToPIM();
        await expect(pimPage.pimTitle).toBeVisible();

        await pimPage.goToAddEmployee();

        await pimPage.fillFirstName('John');
        await expect(pimPage.firstNameInput).toHaveValue('John');

        await pimPage.fillLastName('Doe');
        await expect(pimPage.lastNameInput).toHaveValue('Doe');

        const employeeId = generateEmployeeId();

        await pimPage.fillEmployeeId(employeeId);
        await expect(pimPage.employeeIdInput).toHaveValue(employeeId);

        await pimPage.saveEmployee();

        await expect(pimPage.successToast).toBeVisible();
        await expect(pimPage.successToast).toContainText('Successfully Saved');

        await expect(pimPage.personalDetailsTitle).toBeVisible();
        await expect(pimPage.firstNameInput).toHaveValue('John');
        await expect(pimPage.lastNameInput).toHaveValue('Doe');

        //await page.pause();
        //await expect(page).toHaveURL(/pim\/addEmployee/);
    });

    // Delete a newly created employee
    test('User should be able to delete a newly created employee @regression', async ({ loginPage, page }) => {
        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await dashboardPage.goToPIM();
        await expect(pimPage.pimTitle).toBeVisible();

        await pimPage.goToAddEmployee();

        await pimPage.fillFirstName('Delete');
        await pimPage.fillLastName('Test');

        const employeeId = generateEmployeeId();

        await pimPage.fillEmployeeId(employeeId);
        await pimPage.saveEmployee();

        await expect(pimPage.successToast).toBeVisible();
        await expect(pimPage.successToast).toContainText('Successfully Saved');
        await pimPage.goToEmployeeList();
        await expect(pimPage.pimTitle).toBeVisible();
        const employeeRow = pimPage.getEmployeeRowById(employeeId);

        await expect(employeeRow).toBeVisible();
        await pimPage.deleteEmployee(employeeId);

        await expect(pimPage.successToast).toBeVisible();
        await expect(pimPage.successToast).toContainText('Successfully Deleted');
        await expect(pimPage.getEmployeeRowById(employeeId)).toHaveCount(0);
    });

    // Duplicate Employee ID should not be accepted
    test('User should not be able to create employee with duplicate ID @regression', async ({ loginPage, page }) => {

        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await dashboardPage.goToPIM();
        await expect(pimPage.pimTitle).toBeVisible();

        const employeeId = await pimPage.getFirstEmployeeId();

        await pimPage.goToAddEmployee();

        await pimPage.fillFirstName('Jane');
        await pimPage.fillLastName('Doe');

        await pimPage.fillEmployeeId(employeeId);

        await expect(pimPage.employeeIdAlreadyExistsMessage).toBeVisible();
    });

    test('User should be able to search employee by ID @regression', async ({ loginPage, page }) => {

        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await dashboardPage.goToPIM();
        await expect(pimPage.pimTitle).toBeVisible();

        const employeeId = await pimPage.getFirstEmployeeId();

        const employeeResult = await pimPage.searchEmployeeById(employeeId);

        await expect(employeeResult).toHaveText(employeeId);

    });

    // Open the first employee details and verify the employee ID
    test('User should be able to open first employee details and verify employee ID @regression', async ({ loginPage, page }) => {

        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await dashboardPage.goToPIM();
        await expect(pimPage.pimTitle).toBeVisible();

        const employeeId = await pimPage.getFirstEmployeeId();

        await pimPage.openFirstEmployeeDetails();

        await expect(pimPage.personalDetailsTitle).toBeVisible();
        await expect(pimPage.personalDetailsEmployeeIdInput).toHaveValue(employeeId);
    });
});
