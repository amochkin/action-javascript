import * as core from '@actions/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fs from 'fs'; // <-- Import hack to fix "TypeError: Cannot redefine property: readFileSync"

import { run } from '../src/action';

describe('Function `run` general tests', () => {
	test('is exported, can be compiled and can be imported', () => {
		expect(run).toBe(run);
	});
});
