/**
 * Delete undefined members from payload
 * @param obj any Object to delete members from
 */
export function deleteUndefinedMembers(obj: any): any {
	for (const key in obj) {
		if (obj[key] === undefined) {
			delete obj[key];
		}
	}

	return obj;
}
