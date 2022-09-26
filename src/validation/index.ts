import { validateSync, ValidationError } from 'class-validator';

/**
 * Check if a string is an integer (signed/unsigned)
 *
 * @param str String to check
 * @returns Returns true if the string is int
 */
export function isIntString(str: string): boolean {
	return (
		typeof str === 'string' &&
		Number.isInteger(Number(str))
	);
}

/**
 * Run validation on a model; allowing ints as strings
 *
 * @param obj Object to check
 * @returns Returns true if the string is int
 */
export function validateAllowingStrings(obj: object): ValidationError[] {
	const validationErrors = validateSync(obj, {
		skipMissingProperties: true
	});

	return validationErrors.filter(error => {
		const constraints = error.constraints;

		if (
			'isInt' in constraints &&
			isIntString(error.value)
		) {
			delete constraints.isInt;
		}

		return Object.keys(error.constraints).length;
	});
}
