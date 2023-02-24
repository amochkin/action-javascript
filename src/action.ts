import * as core from '@actions/core';
import { keyValue } from 'ferramenta';
import { InputType, ReturnType } from './types/InputTypes';
import { detectType } from './utils/detectType';
import { DEFAULT_INPUT_JS, DEFAULT_OUTPUT_RESULT } from './constants';

const workspace = process.env.GITHUB_WORKSPACE ?? './';

/**
 * Writes value to the output.
 * @param outputValue
 * @param outputName
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const output = (outputValue: any, outputName = 'value'): void => {
	core.debug(keyValue({ outputName, outputValue }));
	core.setOutput(outputName, outputValue);
};

/**
 * Reads input value and casts it to the specified type.
 * @param name Input name.
 * @param [type] Input type, if not specified it will be detected automatically.
 * @returns Input value.
 */
const input = <T extends InputType>(name: string, type?: T): ReturnType<T> => {
	if (!name) {
		throw new Error('Input name is required.');
	}

	const value = core.getInput(name);

	if (!type) {
		type = detectType(value) as T;
		core.debug(`Input type detected: ${type}`);
	}

	if (type === 'string') {
		return value as unknown as ReturnType<T>;
	} else if (type === 'boolean') {
		return Boolean(value) as unknown as ReturnType<T>;
	} else if (type === 'number') {
		return Number(value) as unknown as ReturnType<T>;
	} else if (type === 'string[]') {
		return value.split(',') as unknown as ReturnType<T>;
	} else if (type === 'boolean[]') {
		return value.split(',').map(Boolean) as unknown as ReturnType<T>;
	} else if (type === 'number[]') {
		return value.split(',').map(Number) as unknown as ReturnType<T>;
	} else {
		throw new Error(`Unsupported type: ${type}`);
	}
};

export const run = () => {
	const jsInput = input('js_input', 'string');
	const jsResult = input('js_result', 'string');
	const js = input(jsInput || DEFAULT_INPUT_JS, 'string');

	if (!js) {
		throw new Error('"js" input is required.');
	}

	core.debug('Resolved parameters: ' + keyValue({ workspace, js, jsInput, jsResult }));

	try {
		const result = eval(js);
		output(result, jsResult || DEFAULT_OUTPUT_RESULT);
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error);
		} else {
			core.setFailed(String(error));
		}
	}
};
