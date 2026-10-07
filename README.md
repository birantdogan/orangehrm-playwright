# OrangeHRM Playwright Test Automation

UI test automation project for the OrangeHRM demo application using **Playwright** and **TypeScript**.

## Tech Stack

* Playwright
* TypeScript
* Node.js
* Playwright Test
* GitHub Actions

## Project Structure

```text
fixtures/      # Custom Playwright fixtures
pages/         # Page Object Model classes
test-data/     # Test data
tests/         # Test scenarios
utils/         # Reusable test utilities
.github/       # GitHub Actions workflows
```

## Running Tests

Install dependencies:

```bash
npm install
```

Install Chromium:

```bash
npx playwright install chromium
```

Run all tests:

```bash
npx playwright test
```

Run smoke tests:

```bash
npx playwright test --grep "@smoke"
```

Run regression tests:

```bash
npx playwright test --grep "@regression"
```

Open the HTML report:

```bash
npx playwright show-report
```

## Automation Approach

The project uses the **Page Object Model**, reusable fixtures, dynamic test data, and Playwright assertions to keep test scenarios maintainable and reliable.

## CI

Tests are automatically executed through **GitHub Actions** and validated before changes are merged into `main`.

## Test Environment

Tests are executed against the public OrangeHRM demo application:

https://opensource-demo.orangehrmlive.com/
