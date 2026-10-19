import { test, expect } from '../fixtures/login.fixture';
import { users } from '../test-data/users';

test.describe('Recruitment Tests', () => {
    test('Recruitment page should be displayed @smoke', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();

        await expect(
            page.getByRole('heading', { name: 'Recruitment', exact: true })
        ).toBeVisible();
    });

    test('Recruitment navigation options should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();

        const topbarMenu = page.getByRole('navigation', {
            name: 'Topbar Menu',
        });

        await expect(topbarMenu.getByText('Candidates', { exact: true })).toBeVisible();
        await expect(topbarMenu.getByText('Vacancies', { exact: true })).toBeVisible();
    });

    test('Candidates page should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();
        await page.getByRole('link', { name: 'Candidates' }).click();

        await expect(
            page.getByRole('heading', { name: 'Candidates', exact: true })
        ).toBeVisible();
    });

    test('Vacancies page should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();
        await page.getByRole('link', { name: 'Vacancies' }).click();

        await expect(
            page.getByRole('heading', { name: 'Vacancies', exact: true })
        ).toBeVisible();
    });

    test('Add Candidate form should be displayed @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();

        await page.getByRole('button', { name: 'Add' }).click();

        await expect(
            page.getByRole('heading', { name: 'Add Candidate' })
        ).toBeVisible();
    });

    test('Create a new candidate @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();
        await page.getByRole('button', { name: 'Add' }).click();

        const firstName = `Test${Date.now()}`;
        const lastName = 'Candidate';
        const email = `candidate${Date.now()}@example.com`;

        await page.getByPlaceholder('First Name').fill(firstName);
        await page.getByPlaceholder('Last Name').fill(lastName);

        await page
            .locator('.oxd-input-group')
            .filter({ has: page.getByText('Email', { exact: true }) })
            .locator('input')
            .fill(email);

        await page.getByRole('button', { name: 'Save' }).click();

        await expect(
            page.getByText('Successfully Saved')
        ).toBeVisible();
    });

    test('Search candidate by name @regression', async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', { name: 'Recruitment' }).click();
        await page.getByRole('button', { name: 'Add' }).click();

        const firstName = `Test${Date.now()}`;
        const lastName = 'Candidate';
        const fullName = `${firstName} ${lastName}`;
        const email = `candidate${Date.now()}@example.com`;

        await page.getByPlaceholder('First Name').fill(firstName);
        await page.getByPlaceholder('Last Name').fill(lastName);

        await page
            .locator('.oxd-input-group')
            .filter({ has: page.getByText('Email', { exact: true }) })
            .locator('input')
            .fill(email);

        await page.getByRole('button', { name: 'Save' }).click();

        await expect(
            page.getByText('Successfully Saved')
        ).toBeVisible();

        // Return to Candidates list
        await page.getByText('Candidates', { exact: true }).click();

        // Search for the newly created candidate
        const candidateName = page.getByPlaceholder('Type for hints...');

        await candidateName.fill(firstName);

        const candidateOption = page
            .locator('.oxd-autocomplete-option')
            .filter({ hasText: fullName });

        await expect(candidateOption).toBeVisible();
        await candidateOption.click();

        await page.getByRole('button', { name: 'Search' }).click();

        // Verify the candidate in search results
        await expect(
            page.locator('.oxd-table-body').getByText(fullName, {
                exact: true,
            })
        ).toBeVisible();
    });
});