const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../test-results/results.json');
const target = path.join(__dirname, '../test-results/results-simulation.json');

const report = JSON.parse(fs.readFileSync(source, 'utf8'));

function findFirstTest(suites) {
    for (const suite of suites || []) {
        for (const spec of suite.specs || []) {
            if (spec.tests?.length) {
                return { spec, test: spec.tests[0] };
            }
        }

        const found = findFirstTest(suite.suites);
        if (found) return found;
    }

    return null;
}

const selected = findFirstTest(report.suites);

if (!selected) {
    throw new Error('No test found for simulation.');
}

const { spec, test } = selected;

test.status = 'unexpected';

test.results = [{
    status: 'failed',
    duration: 5000,
    errors: [{
        message: 'SIMULATED FAILURE: Expected element to be visible, but it was not found.'
    }]
}];

report.stats.expected -= 1;
report.stats.unexpected += 1;

fs.writeFileSync(target, JSON.stringify(report, null, 2));

console.log(`Simulation created: ${target}`);
console.log(`Simulated failed test: ${spec.title}`);