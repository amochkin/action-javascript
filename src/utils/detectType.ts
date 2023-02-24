import { InputType } from '../types/InputTypes';

/**
 * Detects input type.
 * @param value
 * @returns Input type.
 */
export const detectType = (value: string): InputType => {
	if (value === 'true' || value === 'false') {
		return 'boolean';
	} else if (!Number.isNaN(Number(value))) {
		return 'number';
	} else if (value.includes(',')) {
		const values = value.split(',');
		if (values.every((v) => v === 'true' || v === 'false')) {
			return 'boolean[]';
		} else if (values.every((v) => !Number.isNaN(Number(v)))) {
			return 'number[]';
		} else {
			return 'string[]';
		}
	} else {
		return 'string';
	}
};
