import * as core from '@actions/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fs from 'fs'; // <-- Import hack to fix "TypeError: Cannot redefine property: readFileSync"

import { run } from '../src/action';

interface IRunInputs {
	js?: string;
	js_input?: string;
	js_result?: string;
	test_input?: string;
}

interface ITestCase {
	name: string;
	inputs: IRunInputs;
	output: any;
}

describe('Function `run` general tests', () => {
	test('is exported, can be compiled and can be imported', () => {
		expect(run).toBe(run);
	});
});

describe('Execution tests', () => {
	const defaultInputs: IRunInputs = {
		js_result: 'result',
		js_input: 'js',
	};

	const executionTestFactory = (inputs: IRunInputs = defaultInputs, output: string) => {
		jest.clearAllMocks();

		jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return inputs[name as keyof IRunInputs] || ('' as any);
		});
		jest.spyOn(core, 'getBooleanInput').mockImplementation((name: string) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return inputs[name as keyof IRunInputs] || (false as any);
		});

		const setOutputSpy = jest.spyOn(core, 'setOutput');
		// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
		setOutputSpy.mockImplementation((_name: string, _value: string) => {});

		run();

		expect(setOutputSpy).toBeCalledWith(inputs.js_result, output);
	};

	const executionTestCases: ITestCase[] = [
		{
			name: 'Arithmetic addition',
			inputs: { ...defaultInputs, js: '2 + 2' },
			output: '4',
		},
		{
			name: 'String concatenation',
			inputs: { ...defaultInputs, js: '"Hello " + "World!"' },
			output: 'Hello World!',
		},
		{
			name: 'String interpolation',
			inputs: { ...defaultInputs, js: '`Hello ${"World!"}`' },
			output: 'Hello World!',
		},
		{
			name: 'Array concatenation',
			inputs: { ...defaultInputs, js: '[1, 2, 3].concat([4, 5, 6])' },
			output: '1,2,3,4,5,6',
		},
		{
			name: 'Array spread',
			inputs: { ...defaultInputs, js: '[1, 2, 3, ...[4, 5, 6]]' },
			output: '1,2,3,4,5,6',
		},
		{
			name: 'Array destructuring',
			inputs: { ...defaultInputs, js: 'const [a, b, c] = [1, 2, 3]; `${a}, ${b}, ${c}`' },
			output: '1, 2, 3',
		},
		{
			name: 'Object destructuring',
			inputs: { ...defaultInputs, js: 'const { a, b, c } = { a: 1, b: 2, c: 3 }; `${a}, ${b}, ${c}`' },
			output: '1, 2, 3',
		},
		{
			name: 'Read arbitrary input',
			inputs: { ...defaultInputs, test_input: 'test12345', js: '`${input("test_input")}`' },
			output: 'test12345',
		},
		{
			name: 'Output to default output',
			inputs: { ...defaultInputs, js: 'output("test12345", "result")' },
			output: 'test12345',
		},
		{
			name: 'Output to arbitrary output',
			inputs: { ...defaultInputs, js_result: 'test_output', js: 'output("test12345", "test_output")' },
			output: 'test12345',
		},
	];

	executionTestCases.forEach((t, i) =>
		test(`${t.name} [${i + 1}]: inputs: ${JSON.stringify(t.inputs)} expected-output: '${t.output}'`, () =>
			executionTestFactory(t.inputs, t.output)),
	);
});
