/**
 * Delete undefined members from payload
 * @param obj Object to delete members from
 * @return Returns the new payload
 */
export function deleteUndefinedMembers(obj: any): any {
	for (const key in obj) {
		if (obj[key] === undefined) {
			delete obj[key];
		}
	}

	return obj;
}
