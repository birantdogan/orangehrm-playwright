
import { Page, expect } from '@playwright/test';

export class RecruitmentPage {
    constructor(private page: Page) { }

    async deleteCandidate(fullName: string) {
        const candidateRow = this.page
            .getByRole('row')
            .filter({ hasText: fullName });

        await expect(candidateRow).toBeVisible();

        // Click delete button for the selected candidate
        await candidateRow
            .getByRole('button')
            .filter({
                has: this.page.locator('i.bi-trash'),
            })
            .click();

        // Confirm deletion
        const deleteDialog = this.page.locator('[role="document"]').filter({
            hasText: 'Are you Sure?',
        });

        await expect(deleteDialog).toBeVisible();
        await expect(
            deleteDialog.getByText('Are you Sure?')
        ).toBeVisible();

        await deleteDialog
            .getByRole('button', { name: 'Yes, Delete' })
            .click();
    }

    async searchCandidate(firstName: string, fullName: string) {
        // Navigate to Candidates list
        await this.page.goto(
            '/web/index.php/recruitment/viewCandidates',
            { waitUntil: 'domcontentloaded' }
        );

        // Verify correct page URL
        await expect(this.page).toHaveURL(/recruitment\/viewCandidates/);

        // Wait for Candidates page to become visible
        const candidatesTitle = this.page.getByRole('heading', {
            name: 'Candidates',
            exact: true,
        });

        await expect(candidatesTitle).toBeVisible();

        // Search candidate by name
        const candidateName = this.page.getByPlaceholder('Type for hints...');
        await expect(candidateName).toBeVisible();

        await candidateName.fill(firstName);

        const candidateOption = this.page
            .getByRole('option')
            .filter({ hasText: fullName });

        await expect(candidateOption).toBeVisible();
        await candidateOption.click();

        await this.page.getByRole('button', { name: 'Search' }).click();

        // Verify the candidate appears in search results
        const candidateRow = this.page
            .getByRole('row')
            .filter({ hasText: fullName });

        await expect(candidateRow).toBeVisible();

        return candidateRow;
    }
}
