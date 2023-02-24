type BaseType = string | boolean | number;

export type AllowedType = BaseType | BaseType[];

export type InputType = 'string' | 'boolean' | 'number' | 'string[]' | 'boolean[]' | 'number[]';
export type AutoType = 'auto';

export type InputAutoType = InputType | AutoType;

export type ReturnType<T extends InputType> = T extends 'string'
	? string
	: T extends 'boolean'
	? boolean
	: T extends 'number'
	? number
	: T extends 'string[]'
	? Array<string>
	: T extends 'boolean[]'
	? Array<boolean>
	: T extends 'number[]'
	? Array<number>
	: never;
