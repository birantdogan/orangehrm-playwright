# OrangeHRM Playwright Test Automation

[![Playwright Tests](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml)

A UI test automation project built with **Playwright** and **TypeScript** to validate key workflows in the [OrangeHRM demo application](https://opensource-demo.orangehrmlive.com/).

The project contains **40 automated tests** across six application modules. It uses the **Page Object Model (POM)**, reusable Playwright fixtures, dynamic test data, and GitHub Actions for continuous integration.

## Test Coverage

| Module | Scenarios covered |
| --- | --- |
| Login & Logout | Successful and unsuccessful login, required-field validation, logout |
| PIM | Employee creation, search, editing, deletion, duplicate ID validation |
| Admin | User management, searching, filtering, creation, editing, deletion |
| Recruitment | Candidate and vacancy navigation, candidate creation and search |
| Leave | Leave-related workflows and validations |
| Time | Time-related workflows and validations |

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
   npm install
   ```

3. Install the Chromium browser:

   ```bash
   npx playwright install chromium
   ```

4. Configure any required environment variables for the test credentials according to your local setup. Do not commit secrets or `.env` files containing real credentials.

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Run all tests in Chromium |
| `npm run test:headed` | Run tests with the browser visible |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:regression` | Run regression tests |
| `npm run test:report` | Open the Playwright HTML report |

The npm test scripts use **one worker** to reduce contention when testing the shared public demo environment.

## Automation Approach

- **Page Object Model:** Page locators and interactions are organized into reusable classes.
- **Custom fixtures:** Shared setup and page objects reduce duplication in test files.
- **Dynamic test data:** Generated identifiers help avoid collisions in create/delete scenarios.
- **Playwright assertions:** Auto-retrying assertions validate UI behavior without fixed sleeps.
- **Smoke and regression tags:** Tests can be executed by purpose.
- **Test stability:** Explicit synchronization handles loading overlays and asynchronous UI options where needed.

## Reporting and Debugging

Playwright generates an **HTML test report** after execution. Open it with:

```bash
npm run test:report
```

The Playwright configuration also captures **traces on the first retry in CI**, helping investigate failed tests.

## Continuous Integration

The [GitHub Actions workflow](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml) runs the Chromium test suite on repository pushes and pull requests. The badge at the top of this README shows the workflow's current status.

## Test Environment

**Application under test:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/)

This project uses a publicly shared demo environment. Application responsiveness and test data may vary, so occasional environment-related failures are possible.

## Repository

[github.com/birantdogan/orangehrm-playwright](https://github.com/birantdogan/orangehrm-playwright)