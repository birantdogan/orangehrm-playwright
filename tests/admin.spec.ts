import { test, expect } from '../fixtures/login.fixture';
import { AdminPage } from '../pages/AdminPage';
import { users, duplicateUserTestData } from '../test-data/users';
import { generateUsername } from '../utils/testData';

test.describe('Admin Tests', () => {
    test('Admin user list should be displayed @smoke', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await expect(adminPage.adminTitle).toBeVisible();
        await expect(adminPage.userRows.first()).toBeVisible();
    });

    test('Admin user should be searchable by username @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.usernameInput.fill('Admin');
        await adminPage.searchButton.click();

        const adminUserRow = page.getByRole('row').filter({
            hasText: 'Admin',
        });

        await expect(adminUserRow.first()).toBeVisible();
    });

    test('Admin users should be filterable by user role @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.userRoleSelect.click();
        await page.getByRole('option', { name: 'Admin', exact: true }).click();

        await adminPage.searchButton.click();

        const adminUserRows = adminPage.userRows.filter({
            has: page.getByText('Admin', { exact: true }),
        });

        await expect(adminUserRows.first()).toBeVisible();
    });

    test('Admin users should be filterable by status @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.statusSelect.click();
        await page.getByRole('option', { name: 'Enabled', exact: true }).click();

        await adminPage.searchButton.click();

        const enabledUserRows = adminPage.userRows.filter({
            has: page.getByText('Enabled', { exact: true }),
        });

        await expect(enabledUserRows.first()).toBeVisible();
    });

    test('Admin user details should be opened from user list @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.editButtons.first().click();

        await expect(
            page.getByRole('heading', { name: 'Edit User' })
        ).toBeVisible();

        const usernameInput = page
            .locator('.oxd-input-group')
            .filter({
                has: page.getByText('Username', { exact: true }),
            })
            .locator('input');

        await expect(usernameInput).toHaveValue(/.+/);
    });

    test('Admin add user page should be displayed @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        await adminPage.addButton.click();

        await expect(adminPage.addUserTitle).toBeVisible();
    });

    test('Admin should be able to create a new user @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);
        const username = generateUsername();
        const password = 'Test@12345';

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();
        await adminPage.addButton.click();

        await expect(adminPage.addUserTitle).toBeVisible();

        await adminPage.addUserRoleSelect.click();
        await page.getByRole('option', { name: 'ESS', exact: true }).click();

        await adminPage.selectEmployee('a');

        await adminPage.addStatusSelect.click();
        await page.getByRole('option', { name: 'Enabled', exact: true }).click();

        await adminPage.addUsernameInput.fill(username);
        await adminPage.addPasswordInput.fill(password);
        await adminPage.addConfirmPasswordInput.fill(password);

        await adminPage.saveButton.click();

        await expect(
            page.getByText('Successfully Saved', { exact: true })
        ).toBeVisible();
    });

    test('Admin should not be able to create a user with duplicate username @regression', async ({ loginPage, page }) => {
        const adminPage = new AdminPage(page);
        const password = 'Test@12345';

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();
        await adminPage.addButton.click();

        await expect(adminPage.addUserTitle).toBeVisible();

        await adminPage.addUserRoleSelect.click();
        await page.getByRole('option', { name: 'ESS', exact: true }).click();

        await adminPage.selectEmployee('a');

        await adminPage.addStatusSelect.click();
        await page.getByRole('option', { name: 'Enabled', exact: true }).click();

        await adminPage.addUsernameInput.fill(duplicateUserTestData.username);
        await adminPage.addPasswordInput.fill(password);
        await adminPage.addConfirmPasswordInput.fill(password);

        await adminPage.saveButton.click();

        await expect(
            page.getByText('Already exists', { exact: false })
        ).toBeVisible();
    });

    test('Admin should be able to edit a user @regression', async ({ page, loginPage }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(users.validUser.username, users.validUser.password);

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        // Create a new user
        const username = generateUsername();
        const password = 'Test@12345';

        await adminPage.addButton.click();

        await adminPage.addUserRoleSelect.click();
        await page.getByRole('option', { name: 'ESS' }).click();

        await adminPage.selectEmployee('a');

        await adminPage.addStatusSelect.click();
        await page.getByRole('option', { name: 'Enabled' }).click();

        await adminPage.addUsernameInput.fill(username);
        await adminPage.addPasswordInput.fill(password);
        await adminPage.addConfirmPasswordInput.fill(password);

        await adminPage.saveButton.click();

        await expect(page.getByText('Successfully Saved')).toBeVisible();
        await expect(adminPage.adminTitle).toBeVisible();

        // Find the newly created user
        await adminPage.usernameInput.fill(username);
        await adminPage.searchButton.click();

        const userRow = adminPage.userRows.filter({
            hasText: username,
        });

        await expect(userRow).toBeVisible();

        // Open the Edit User page
        await userRow.locator('.oxd-icon.bi-pencil-fill').click();

        await expect(adminPage.editUserTitle).toBeVisible();

        // Update the username
        // Update the user's status
        await adminPage.statusSelect.click();
        await page.getByRole('option', { name: 'Disabled', exact: true }).click();

        await adminPage.saveButton.click();

        await expect(
            page.getByText('Successfully Updated', { exact: true })
        ).toBeVisible();

        // Verify the updated user in the list
        await adminPage.goToUsers();
        await adminPage.usernameInput.fill(username);
        await adminPage.searchButton.click();

        const updatedUserRow = adminPage.userRows.filter({
            hasText: username,
        });

        await expect(updatedUserRow).toBeVisible();
        await expect(updatedUserRow).toContainText('Disabled');;
    });

    test('Admin should be able to delete a user @regression', async ({ page, loginPage }) => {
        const adminPage = new AdminPage(page);

        await loginPage.login(users.validUser.username, users.validUser.password);

        await page.getByRole('link', { name: 'Admin' }).click();
        await adminPage.goToUsers();

        // Create a new user
        const username = generateUsername();
        const password = 'Test@12345';

        await adminPage.addButton.click();

        await adminPage.addUserRoleSelect.click();
        await page.getByRole('option', { name: 'ESS' }).click();

        await adminPage.selectEmployee('a');

        await adminPage.addStatusSelect.click();
        await page.getByRole('option', { name: 'Enabled' }).click();

        await adminPage.addUsernameInput.fill(username);
        await adminPage.addPasswordInput.fill(password);
        await adminPage.addConfirmPasswordInput.fill(password);

        await adminPage.saveButton.click();

        await expect(page.getByText('Successfully Saved')).toBeVisible();
        await expect(adminPage.adminTitle).toBeVisible();

        // Find the newly created user
        await adminPage.usernameInput.fill(username);
        await adminPage.searchButton.click();

        const userRow = adminPage.userRows.filter({
            hasText: username,
        });

        await expect(userRow).toBeVisible();

        // Click the delete button
        await userRow.locator('.oxd-icon.bi-trash').click();

        // Confirm user deletion
        const deleteDialog = page.getByRole('dialog');

        await expect(deleteDialog).toBeVisible();

        await deleteDialog
            .getByRole('button', { name: 'Yes, Delete' })
            .click();

        await expect(
            page.getByText('Successfully Deleted')
        ).toBeVisible();

        // Verify the deleted user is no longer in the list
        await adminPage.usernameInput.fill(username);
        await adminPage.searchButton.click();

        await expect(
            page.getByText('No Records Found', { exact: true }).first()
        ).toBeVisible();
    });

});