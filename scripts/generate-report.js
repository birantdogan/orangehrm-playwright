const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const inputFile = process.argv.includes('--simulation')
    ? 'results-simulation.json'
    : 'results.json';

const inputPath = path.join(__dirname, '../test-results', inputFile);
const outputFile = process.argv.includes('--simulation')
    ? 'test-execution-report-simulation.pdf'
    : 'test-execution-report.pdf';

const outputPath = path.join(__dirname, '..', outputFile);

if (!fs.existsSync(inputPath)) {
    console.error('Playwright JSON report not found.');
    process.exit(1);
}

const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const stats = report.stats;

if (!stats) {
    console.error('Test statistics not found in JSON report.');
    process.exit(1);
}

const total = stats.expected + stats.unexpected + stats.skipped + stats.flaky;
const duration = (stats.duration / 1000).toFixed(2);
const tests = collectTests(report.suites);
// Group test results by module
const moduleResults = {};

for (const test of tests) {
    const moduleName = path.basename(test.module || 'unknown');

    if (!moduleResults[moduleName]) {
        moduleResults[moduleName] = {
            total: 0,
            passed: 0,
            failed: 0,
            flaky: 0,
            skipped: 0
        };
    }

    moduleResults[moduleName].total++;

    if (moduleResults[moduleName][test.status] !== undefined) {
        moduleResults[moduleName][test.status]++;
    }
}
const passed = tests.filter(test => test.status === 'passed').length;
const failed = tests.filter(test => test.status === 'failed').length;
const flaky = tests.filter(test => test.status === 'flaky').length;
const skipped = tests.filter(test => test.status === 'skipped').length;

const passRate = total > 0
    ? ((passed / total) * 100).toFixed(1)
    : '0.0';

const pdf = new PDFDocument({ margin: 50 });
const stream = fs.createWriteStream(outputPath);

pdf.pipe(stream);

// Report Header
pdf.rect(0, 0, pdf.page.width, 155)
    .fill('#142D49');

pdf.fillColor('#A8C5DF')
    .fontSize(10)
    .text('ORANGEHRM  /  QUALITY ASSURANCE', 50, 38);

pdf.fillColor('#FFFFFF')
    .fontSize(24)
    .text('Test Execution Report', 50, 65);

pdf.fillColor('#D6E5F2')
    .fontSize(10)
    .text('Playwright  |  TypeScript  |  Chromium', 50, 105);

// Execution metadata
pdf.fillColor('#374151')
    .fontSize(10)
    .text(
        `Execution Date: ${new Date(stats.startTime).toLocaleString('en-GB')}`,
        50,
        175
    );

pdf.text(`Execution Duration: ${duration} seconds`, 50, 193);

// Move below header
pdf.y = 230;
// Execution Summary
pdf.fontSize(16)
    .fillColor('#142D49')
    .text('Execution Summary');

const metrics = [
    { label: 'TOTAL TESTS', value: total, color: '#142D49' },
    { label: 'PASSED', value: passed, color: '#16803C' },
    { label: 'FAILED', value: failed, color: '#DC2626' },
    { label: 'PASS RATE', value: `${passRate}%`, color: '#142D49' }
];

const cardY = pdf.y + 18;
const cardWidth = 116;
const cardHeight = 76;
const cardGap = 10;

metrics.forEach((metric, index) => {
    const x = 50 + index * (cardWidth + cardGap);

    pdf.roundedRect(x, cardY, cardWidth, cardHeight, 7)
        .fill('#F1F5F9');

    pdf.fillColor('#64748B')
        .fontSize(9)
        .text(metric.label, x + 12, cardY + 13, {
            width: cardWidth - 24
        });

    pdf.fillColor(metric.color)
        .fontSize(22)
        .text(String(metric.value), x + 12, cardY + 34, {
            width: cardWidth - 24
        });
});

pdf.y = cardY + cardHeight + 20;

pdf.fontSize(10)
    .fillColor('#64748B')
    .text(
        `Flaky: ${flaky}    |    Skipped: ${skipped}`,
        50,
        pdf.y,
        { width: 495 }
    );
pdf.moveDown(0.5);

pdf.fontSize(10)
    .fillColor('gray')
    .text(
        'Note: Expected results may include expected failures.',
        50,
        pdf.y,
        { width: 495 }
    );
// Collect test results from nested Playwright suites
function collectTests(suites, collected = []) {
    for (const suite of suites || []) {
        for (const spec of suite.specs || []) {
            for (const test of spec.tests || []) {
                const attempts = test.results || [];
                const lastAttempt = attempts[attempts.length - 1];

                const actualStatus = lastAttempt?.status || 'unknown';

                const status =
                    test.status === 'unexpected' ? 'failed' :
                        test.status === 'flaky' ? 'flaky' :
                            test.status === 'skipped' ? 'skipped' :
                                actualStatus === 'passed' ? 'passed' :
                                    actualStatus === 'failed' ? 'failed' :
                                        actualStatus;

                collected.push({
                    name: spec.title,
                    module: spec.file,
                    status,
                    expectedStatus: test.expectedStatus,
                    duration: attempts.reduce(
                        (sum, result) => sum + (result.duration || 0),
                        0
                    ),
                    attempts: attempts.length,
                    errors: attempts.flatMap(result => result.errors || [])
                });
            }
        }

        collectTests(suite.suites, collected);
    }

    return collected;
}
// Module Breakdown
pdf.moveDown(2);
pdf.fontSize(16)
    .fillColor('#142D49')
    .text('Module Breakdown', 50, pdf.y, { width: 495 });
pdf.moveDown(0.8);

const columns = [
    { label: 'Module', x: 50 },
    { label: 'Total', x: 230 },
    { label: 'Passed', x: 290 },
    { label: 'Failed', x: 355 },
    { label: 'Flaky', x: 420 },
    { label: 'Skipped', x: 475 }
];

let tableY = pdf.y;

// Table header
const rowHeight = 26;
const tableWidth = 494;

function drawTableHeader(y) {
    pdf.rect(50, y, tableWidth, rowHeight)
        .fill('#142D49');

    pdf.fontSize(9).fillColor('#FFFFFF');

    for (const column of columns) {
        pdf.text(column.label, column.x + 6, y + 8, {
            width: column.label === 'Module' ? 170 : 55,
            lineBreak: false
        });
    }
}

drawTableHeader(tableY);
tableY += rowHeight;

// Table rows
let rowIndex = 0;

for (const [moduleName, result] of Object.entries(moduleResults)) {
    if (tableY + rowHeight > pdf.page.height - 65) {
        pdf.addPage();
        tableY = 50;
        drawTableHeader(tableY);
        tableY += rowHeight;
    }

    pdf.rect(50, tableY, tableWidth, rowHeight)
        .fill(rowIndex % 2 === 0 ? '#F1F5F9' : '#FFFFFF');

    const values = [
        moduleName,
        result.total,
        result.passed,
        result.failed,
        result.flaky,
        result.skipped
    ];

    values.forEach((value, index) => {
        pdf.fontSize(9)
            .fillColor(
                index === 2 ? '#16803C' :
                    index === 3 && value > 0 ? '#DC2626' :
                        '#374151'
            )
            .text(String(value), columns[index].x + 6, tableY + 8, {
                width: index === 0 ? 170 : 55,
                lineBreak: false
            });
    });

    tableY += rowHeight;
    rowIndex++;
}
// Failure Analysis
if (failed > 0) {
    pdf.addPage();
    pdf.y = 50;
} else {
    pdf.y = tableY + 25;
}

pdf.fontSize(16)
    .fillColor('#142D49')
    .text('Failure Analysis', 50, pdf.y, { width: 495 });

pdf.moveDown(0.8);

if (failed === 0) {
    pdf.roundedRect(50, pdf.y, 494, 45, 6)
        .fill('#ECFDF5');

    pdf.fontSize(11)
        .fillColor('#16803C')
        .text(
            'No failures detected during this execution.',
            65,
            pdf.y + 14,
            { width: 460 }
        );
} else {
    pdf.fontSize(11)
        .fillColor('#DC2626')
        .text(
            `${failed} test(s) failed during this execution.`,
            50,
            pdf.y,
            { width: 495 }
        );

    for (const test of tests.filter(test => test.status === 'failed')) {
        if (pdf.y > pdf.page.height - 180) {
            pdf.addPage();
            pdf.y = 50;
        }

        pdf.moveDown(1);

        pdf.fontSize(11)
            .fillColor('#142D49')
            .text(test.name, 50, pdf.y, { width: 495 });

        pdf.fontSize(9)
            .fillColor('#64748B')
            .text(`Module: ${path.basename(test.module)}`, 50, pdf.y, { width: 495 })
            .text(`Duration: ${(test.duration / 1000).toFixed(2)} seconds`, 50, pdf.y, { width: 495 });

        const rawError = test.errors[0]?.message || 'No error details available.';

        // Remove terminal ANSI color codes
        const cleanError = rawError.replace(/\x1B\[[0-9;]*m/g, '');

        pdf.moveDown(0.5);

        pdf.fontSize(9)
            .fillColor('#DC2626')
            .text(cleanError.slice(0, 1200), 50, pdf.y, {
                width: 495
            });
    }
}
// Test Case Details
pdf.addPage();

pdf.fontSize(18)
    .fillColor('black')
    .text('Test Case Details');

pdf.moveDown();

for (const test of tests) {
    const statusColor =
        test.status === 'passed' ? 'green' :
            test.status === 'failed' ? 'red' : 'gray';

    pdf.fontSize(11).fillColor('black')
        .text(`Test: ${test.name}`);

    pdf.fontSize(10)
        .text(`Module: ${test.module}`)
        .fillColor(statusColor)
        .text(`Status: ${test.status.toUpperCase()}`)
        .fillColor('black')
        .text(`Duration: ${(test.duration / 1000).toFixed(2)} seconds`);

    if (test.errors.length > 0) {
        for (const error of test.errors) {
            pdf.fillColor('red')
                .text(`Error: ${error.message || 'Unknown error'}`);
        }
    }

    pdf.moveDown();
}
pdf.end();

stream.on('finish', () => {
    console.log(`PDF report generated: ${outputPath}`);
});