import { validateSync } from 'class-validator';

export function isIntString(str: string): boolean {
	return (
		typeof str === 'string' &&
		Number.isInteger(Number(str))
	);
}

export function validateAllowingStrings(obj: object) {
	let validationErrors = validateSync(obj, {
		skipMissingProperties: true
	});

	validationErrors = validationErrors.filter(error => {
		const constraints = error.constraints;

		if (
			'isInt' in constraints &&
			isIntString(error.value)
		) {
			delete constraints.isInt;
		}

		return Object.keys(error.constraints).length;
	});

	return validationErrors;
}
