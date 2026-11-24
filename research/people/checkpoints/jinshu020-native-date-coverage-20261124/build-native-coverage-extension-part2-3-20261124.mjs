#!/usr/bin/env node
import { writePersonChecksPart } from './lib/native-coverage-person-check.mjs';

const p2 = writePersonChecksPart(2, 100, 200, 'native-date-coverage-personChecks-part2-20261124.json');
const p3 = writePersonChecksPart(3, 200, 281, 'native-date-coverage-personChecks-part3-20261124.json');
console.log('part2', p2);
console.log('part3', p3);