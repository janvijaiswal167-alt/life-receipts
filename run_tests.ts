/**
 * Comprehensive Test Runner for LIFE//RECEIPTS Engines
 * Executes LifeGraphEngine and MomentsEngine test suites.
 */

import { runLifeGraphEngineTests } from './src/engine/lifeGraphEngine.test.ts';
import { runMomentsEngineTests } from './src/engine/momentsEngine.test.ts';
import { runPatternEngineTests } from './src/engine/patternEngine.test.ts';
import { runComparisonEngineTests } from './src/engine/comparisonEngine.test.ts';

console.log('----------------------------------------------------');
console.log('1. RUNNING GRAPH ENGINE TESTS');
console.log('----------------------------------------------------');
const graphResult = runLifeGraphEngineTests();

console.log('\n----------------------------------------------------');
console.log('2. RUNNING MOMENTS ENGINE TESTS');
console.log('----------------------------------------------------');
const momentsResult = runMomentsEngineTests();

console.log('\n----------------------------------------------------');
console.log('3. RUNNING PATTERN ENGINE TESTS');
console.log('----------------------------------------------------');
const patternResult = runPatternEngineTests();

console.log('\n----------------------------------------------------');
console.log('4. RUNNING COMPARISON ENGINE TESTS');
console.log('----------------------------------------------------');
const comparisonResult = runComparisonEngineTests();

const totalPassed = graphResult.passed + momentsResult.passed + patternResult.passed + comparisonResult.passed;
const totalFailed = graphResult.failed + momentsResult.failed + patternResult.failed + comparisonResult.failed;

console.log('\n====================================================');
console.log(`OVERALL SUITE RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('====================================================');

if (totalFailed > 0) {
  console.error(`\nFAILED: ${totalFailed} test(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All ${totalPassed} tests passed successfully!`);
  process.exit(0);
}
