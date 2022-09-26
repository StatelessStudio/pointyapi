import { getMetadataStorage } from 'class-validator';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

const container = getMetadataStorage();
type PropertyRuleSet = Record<string, boolean|any[]>;
type ClassRuleSet = Record<string, PropertyRuleSet>;

function getMetadata(someClass: any): ValidationMetadata[] {
	return container.getTargetValidationMetadatas(
		someClass,
		JSON.stringify(someClass),
		true,
		false,
	);
}

function hasValidConstraints(constraints: ConstraintMetadata[]): boolean {
	return constraints && Array.isArray(constraints) ?
		constraints.filter(c => c !== undefined).length > 0 :
		false;
}

function flatten(keyMetadata: ValidationMetadata[]): PropertyRuleSet {
	const output: PropertyRuleSet = {};

	for (const md of keyMetadata) {
		if (md.constraintCls) {
			const constraints = container.getTargetValidatorConstraints(md.constraintCls);

			for (const constraint of constraints) {
				output[constraint.name] = hasValidConstraints(md.constraints) ? md.constraints : true;
			}
		}
	}

	return output;
}

/**
 * Get class-validator constraints for a class
 * @param someClass BaseModel class(e.g `request.payloadType`)
 * @return Returns each constraint object for each property in the class
 */
export function getValidationConstraints(someClass: any): ClassRuleSet {
	const metadata = getMetadata(someClass);
	const properties = container.groupByPropertyName(metadata);
	const output: Record<string, PropertyRuleSet> = {};

	for (const key in properties) {
		output[key] = flatten(properties[key]);
	}

	return output;
}

/**
 * Get class-validator constraints for a property of a class
 * @param someClass BaseModel class(e.g `request.payloadType`)
 * @param key Property key name
 * @return Returns each constraint object for the property
 */
export function getValidationConstraintsByKey(someClass: any, key: string): PropertyRuleSet {
	const metadata = getMetadata(someClass);

	return flatten(metadata.filter(md => md.propertyName === key));
}
