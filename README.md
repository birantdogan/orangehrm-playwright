# OrangeHRM Playwright Test Automation

[![Playwright Tests](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml)

A UI test automation project built with **Playwright** and **TypeScript** to validate key workflows in the [OrangeHRM demo application](https://opensource-demo.orangehrmlive.com/).

The framework focuses on maintainability, reusable test components, structured reporting, and continuous integration.

## Test Coverage

The automated test suite covers various workflows across the OrangeHRM application.

| Module | Scenarios Covered |
|---|---|
| Login & Logout | Successful and unsuccessful login, required-field validation, logout |
| PIM | Employee creation, search, editing, deletion, duplicate ID validation |
| Admin | User management, searching, role/status filtering, creation, editing, deletion |
| Recruitment | Candidate management, creation, search, deletion, vacancy navigation |
| Leave | Leave navigation, Apply Leave page, leave type and balance visibility |
| Time | Time navigation, Timesheets page, Attendance submenu |

Tests are categorized using `@smoke` and `@regression` tags to support targeted execution.

## Tech Stack

- **Playwright Test** — Browser automation, assertions, and test execution
- **TypeScript** — Test and framework implementation
- **Node.js / npm** — Dependency management and execution scripts
- **Page Object Model (POM)** — Reusable page abstractions
- **PDFKit** — Custom PDF test report generation
- **GitHub Actions** — Continuous integration and automated reporting

## Project Structure

```text
.github/workflows/   # GitHub Actions CI workflow
fixtures/            # Reusable Playwright fixtures
pages/               # Page Object Model classes
scripts/             # Test execution and PDF reporting utilities
test-data/           # Test data and credentials configuration
tests/               # Automated test scenarios
utils/               # Reusable test utilities
playwright.config.ts # Playwright configuration
package.json         # Dependencies and npm scripts
```

Generated reports and test artifacts are stored separately from the source code and excluded from version control.

## Getting Started

**Prerequisites:** Node.js and npm installed.

### 1. Clone the repository

```bash
git clone https://github.com/birantdogan/orangehrm-playwright.git
cd orangehrm-playwright
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install the Chromium browser

```bash
npx playwright install chromium
```

### 4. Configure environment variables

The framework uses the following environment variables for authentication:

```text
ORANGEHRM_USERNAME
ORANGEHRM_PASSWORD
```

Configure these variables in your local environment before running tests.

GitHub Actions retrieves credentials from repository secrets.

**Never commit credentials or `.env` files containing sensitive information.**

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run the complete Chromium test suite and automatically generate a PDF report |
| `npm run test:headed` | Run tests with the browser visible |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:regression` | Run regression tests |
| `npm run test:report` | Open the Playwright HTML report |
| `npm run report:pdf` | Generate a PDF report from existing JSON results |

The default `npm test` command executes the Chromium test suite using a single worker to reduce contention in the shared demo environment.

After execution, a custom reporting script generates a PDF report using the Playwright JSON results.

Other test commands invoke Playwright directly and do not automatically generate the PDF report.

## Automation Approach

The framework follows established test automation practices to improve maintainability, readability, and reliability.

- **Page Object Model:** Reusable page classes encapsulate application interactions and reduce duplication.
- **Semantic locators:** Playwright role-, label-, and placeholder-based locators are preferred, with targeted selectors used where necessary.
- **Reusable fixtures:** Shared setup logic provides consistent test initialization.
- **Dynamic test data:** Generated identifiers help prevent conflicts in the shared test environment.
- **Test data cleanup:** Applicable scenarios remove generated records to reduce interference between executions.
- **Synchronization:** Playwright's auto-waiting and retrying assertions handle asynchronous UI behavior without unnecessary fixed delays.
- **Test categorization:** Smoke and regression tags support different execution needs.
- **Failure investigation:** Trace collection and retry information support debugging and root-cause analysis.

## Reporting and Debugging

The framework supports HTML, JSON, and PDF reporting to provide visibility into test execution and facilitate failure investigation.

### HTML Report

Playwright generates an interactive HTML report containing test results, execution details, and debugging information.

Open the report locally:

```bash
npm run test:report
```

### JSON Report

Playwright generates structured execution results in:

```text
test-results/results.json
```

The JSON report serves as the data source for custom PDF report generation.

### Automated PDF Report

A custom reporting solution built with **PDFKit** generates a structured PDF test execution report.

The report includes:

- Execution summary and test status distribution
- Overall execution duration
- Module-level test breakdown
- Failure analysis and error details when failures occur
- Individual test case results and execution times

The PDF report is generated automatically when running:

```bash
npm test
```

The generated file is saved as:

```text
test-execution-report.pdf
```

To regenerate the PDF using existing JSON results without rerunning the test suite:

```bash
npm run report:pdf
```

The reporting workflow is designed to generate the PDF regardless of whether the test execution succeeds or fails, while preserving the original test execution exit status.

A separate failure simulation utility is available to validate the report's failure analysis functionality without modifying the original execution results.

### Debugging and Retries

The framework uses Playwright's tracing and retry capabilities to support test failure investigation.

CI executions allow retries for failed tests, while local executions run without retries by default.

Tests that pass after retrying are classified as **flaky**, allowing intermittent failures to be distinguished from consistently successful executions.

## Continuous Integration

The project uses [GitHub Actions](https://github.com/birantdogan/orangehrm-playwright/actions/workflows/playwright.yml) to automate test execution and reporting.

The CI workflow:

- Runs on pushes and pull requests targeting the configured main branches
- Installs project dependencies and the required browser
- Executes the Playwright test suite
- Generates the PDF test execution report
- Uploads HTML and PDF reports as downloadable workflow artifacts
- Preserves test execution failures in the workflow status

Authentication credentials are provided through GitHub Actions secrets.

Reports are retained according to the artifact retention configuration defined in the workflow.

The workflow status badge at the top of this README provides visibility into CI execution status.

## Test Environment

**Application under test:** [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com/)

The framework runs against a publicly shared demo environment.

Application responsiveness, shared test data, and environment availability may affect execution stability.

Intermittent failures are investigated using test results, retry information, and available debugging artifacts rather than automatically being attributed to the environment.

## Repository

[github.com/birantdogan/orangehrm-playwright](https://github.com/birantdogan/orangehrm-playwright)