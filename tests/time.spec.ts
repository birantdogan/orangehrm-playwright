
import { test, expect } from '../fixtures/login.fixture';
import { users } from '../test-data/users';

test.describe('Time Tests', () => {

    test.beforeEach(async ({ loginPage, page }) => {
        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );

        await page.getByRole('link', {
            name: 'Time',
            exact: true,
        }).click();
    });

    test('Time page should be displayed @smoke', async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Time', exact: true })
        ).toBeVisible();
    });

    test('Time navigation options should be displayed @regression', async ({ page }) => {
        const topbarMenu = page.getByRole('navigation', {
            name: 'Topbar Menu',
        });

        await expect(topbarMenu.getByText('Timesheets')).toBeVisible();
        await expect(topbarMenu.getByText('Attendance')).toBeVisible();
        await expect(topbarMenu.getByText('Reports')).toBeVisible();
        await expect(topbarMenu.getByText('Project Info')).toBeVisible();
    });

    test('Timesheets page should be displayed @regression', async ({ page }) => {
        const topbarMenu = page.getByRole('navigation', {
            name: 'Topbar Menu',
        });

        await topbarMenu.getByText('Timesheets').click();

        await expect(
            page.getByRole('heading', { name: '/ Timesheets' })
        ).toBeVisible();
    });

    test('Attendance submenu options should be displayed @regression', async ({ page }) => {
        const topbarMenu = page.getByRole('navigation', {
            name: 'Topbar Menu',
        });

        await topbarMenu.getByText('Attendance').click();

        await expect(
            page.getByRole('menuitem', { name: 'My Records' })
        ).toBeVisible();

        await expect(
            page.getByRole('menuitem', { name: 'Punch In/Out' })
        ).toBeVisible();

        await expect(
            page.getByRole('menuitem', { name: 'Employee Records' })
        ).toBeVisible();
    });
});
