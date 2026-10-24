# OrangeHRM Playwright Test Automation

[![Playwright Tests](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml)

A UI test automation project built with **Playwright** and **TypeScript** to validate key workflows in the [OrangeHRM demo application](https://opensource-demo.orangehrmlive.com/).

The project contains **40 automated tests** across six application modules. It uses the **Page Object Model (POM)**, reusable Playwright fixtures, dynamic test data, and GitHub Actions for continuous integration.

## Test Coverage

| Module | Tests | Scenarios covered |
| --- | ---: | --- |
| Login & Logout | 8 | Successful and unsuccessful login, required-field validation, logout |
| PIM | 7 | Employee creation, search, editing, deletion, duplicate ID validation |
| Admin | 10 | User management, searching, role/status filtering, creation, editing, deletion |
| Recruitment | 7 | Candidate management, creation, search, deletion, vacancy navigation |
| Leave | 4 | Leave navigation, Apply Leave page, leave type and balance visibility |
| Time | 4 | Time navigation, Timesheets page, Attendance submenu |
| **Total** | **40** | **6 application modules** |

Tests are tagged as **`@smoke`** or **`@regression`** to support targeted execution.

## Tech Stack

- **Playwright Test** — browser automation, assertions, and test execution
- **TypeScript** — test and framework implementation
- **Node.js / npm** — dependency management and scripts
- **GitHub Actions** — automated CI test execution

## Project Structure

```text
.github/workflows/   # GitHub Actions CI workflow
fixtures/            # Reusable Playwright fixtures
pages/               # Page Object Model classes
test-data/            # Test data and credentials configuration
tests/                # Automated test scenarios
utils/                # Reusable test utilities
playwright.config.ts  # Playwright configuration
package.json          # Dependencies and npm scripts
```

## Getting Started

**Prerequisites:** Node.js and npm installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/birantdogan/orangehrm-playwright.git
   cd orangehrm-playwright
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Install the Chromium browser:

   ```bash
   npx playwright install chromium
   ```

4. Configure the following environment variables with credentials for the OrangeHRM demo environment:

   ```text
   ORANGEHRM_USERNAME
   ORANGEHRM_PASSWORD
   ```

   Set these variables in your shell or local environment before running tests. The GitHub Actions workflow reads them from repository secrets. **Never commit credentials or `.env` files containing secrets.**

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Run all tests in Chromium |
| `npm run test:headed` | Run tests with the browser visible |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:regression` | Run regression tests |
| `npm run test:report` | Open the Playwright HTML report |

The npm test scripts use **one worker** to reduce contention when testing the shared public demo environment.

To run the full suite explicitly with one worker:

```bash
npx playwright test --project=chromium --workers=1
```

## Automation Approach

- **Page Object Model:** Reusable page classes encapsulate interactions for modules that benefit from abstraction.
- **Semantic locators:** Prefer Playwright role-, label-, and placeholder-based locators; use targeted selectors where the UI does not expose accessible names.
- **Reusable fixtures:** Shared login setup helps keep test files consistent.
- **Dynamic test data and cleanup:** Generated identifiers reduce collisions, and create/edit scenarios clean up test records where applicable.
- **Synchronization:** Playwright's auto-waiting and retrying assertions handle asynchronous UI behavior without fixed sleeps.
- **Smoke and regression tags:** Scenarios can be run by purpose.
- **Flaky test investigation:** CI retries and trace collection help distinguish intermittent failures from persistent defects; retries are not treated as a substitute for root-cause analysis.

## Reporting and Debugging

Playwright generates an **HTML test report** after execution. Open it with:

```bash
npm run test:report
```

The configuration captures **traces on the first retry in CI**, supporting investigation of intermittent failures. CI runs use up to **two retries** for failed tests; local runs use no retries by default.

## Continuous Integration

The [GitHub Actions workflow](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml) runs the Chromium test suite on pushes and pull requests targeting `main` or `master`. Credentials are supplied through GitHub Actions secrets. HTML reports are uploaded as workflow artifacts and retained for 30 days.

The badge at the top of this README shows the workflow's current status.

## Test Environment

**Application under test:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/)

This project uses a publicly shared demo environment. Application responsiveness and test data may vary, so occasional environment-related failures are possible. A retry that passes is reported as **flaky** rather than assumed to be an environment issue.

## Repository

[github.com/birantdogan/orangehrm-playwright](https://github.com/birantdogan/orangehrm-playwright)
