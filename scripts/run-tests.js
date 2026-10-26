const { spawnSync } = require('child_process');

const testResult = spawnSync(
    'npx',
    ['playwright', 'test', '--project=chromium', '--workers=1'],
    {
        stdio: 'inherit',
        shell: process.platform === 'win32'
    }
);

if (testResult.error) {
    console.error('Failed to start Playwright:', testResult.error.message);
    process.exit(1);
}

// Generate PDF regardless of test outcome
const reportResult = spawnSync(
    process.execPath,
    ['scripts/generate-report.js'],
    { stdio: 'inherit' }
);

if (reportResult.error || reportResult.status !== 0) {
    console.error('PDF report generation failed.');
}

// Preserve the original test result
process.exit(testResult.status ?? 1);