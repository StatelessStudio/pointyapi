import { MetadataStorage, getFromContainer } from 'class-validator';

/**
 * Get class-validator constraints for a class
 * @param someClass BaseModel class(e.g `request.payloadType`)
 * @param key (Optional) Key to get constraints for. If unset, constraints for
 * 	all keys will be returned.
 */
export function getValidationConstraints(someClass: Function, key?: string) {
	const container = <MetadataStorage>getFromContainer(MetadataStorage);
	const metadata = container.getTargetValidationMetadatas(
		someClass,
		JSON.stringify(someClass)
	);
	const properties = container.groupByPropertyName(metadata);

	const validators = Object.keys(properties).reduce((schema, property) => {
		schema[property] = properties[
			property
		].reduce((propertySchema, { type, constraints }) => {
			if (Array.isArray(constraints) && constraints.length === 1) {
				constraints = constraints[0];
			}

			if (typeof constraints === 'undefined') {
				propertySchema[type] = true;
			}
			else {
				propertySchema[type] = constraints;
			}

			return propertySchema;
		}, {});

		return schema;
	}, {});

	if (key) {
		if (key in validators) {
			return validators[key];
		}
		else {
			return false;
		}
	}
	else {
		return validators;
	}
}
