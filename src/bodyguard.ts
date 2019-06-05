/**
 * # Bodyguards
 *
 * Bodyguards are guards that operate on the body (*request.query,
 * request.body*).  Bodyguards come in two forms:
 * - Guards
 *	- Guards block incoming requests, e.g. a basic user
 *	who tries to delete an admin
 * - Filters
 *	- Filters remove sensitive fields from response bodies
 *
 * ## Decorators
 *
 * Decorators are used to set read/write privelages on your model.  There
 * are several decorators already available for you:
 * - Read
 *  - CanRead(who?)
 *  - AnyoneCanRead()
 *  - OnlySelfCanRead()
 *  - OnlyAdminCanRead()
 * - Write
 *  - CanWrite(who?)
 *  - AnyoneCanWrite()
 *  - OnlySelfCanWrite()
 *  - OnlyAdminCanWrite()
 * - Search
 *  - CanSearch(who?)
 *
 * Decorators which take a *who* parameter default to anyone but also
 * can take a UserRole or BodyguardOwner enum
 *
 * **NOTE: If a member does not have a CanRead or CanWrite key, it will
 * not be able to be read or written!**
 *
 * ### BodyguardKey
 *
 * There is one additional decorator: `BodyguardKey`.  This key will be
 * presented to the guards/filters to authorize the request.  For example, the
 * `userId` of a User would be the BodyguardKey, or the `fromUserId` and
 * `toUserId` would be the BodyguardKeys on a Chat model.  When the
 * bodyguard runs, it will compare the authenticated user with the
 * BodyguardKey of the resource.
 *
 * ## How to Use?
 *
 * Guards, Endpoints, and Responders contain bodyguards underneath.  If you
 * are not writing custom guards or responders, you will only need to set the
 * decorators on your model.
 *
 * If you are writing custom guards or responders, please see the respective
 * documentation to learn more about integrating bodyguard functions
 *
 * ## How to Set Privelages?
 *
 * You will need to add the appropriate bodyguards on your model:
 *
 * ```typescript
 * import { BaseUser } from 'pointyapi/models';
 * import {
 * 	CanRead,
 * 	AnyoneCanRead,
 * 	OnlySelfCanRead,
 * 	OnlyAdminCanRead,
 * 	CanWrite,
 * 	AnyoneCanWrite,
 * 	OnlySelfCanWrite,
 * 	OnlyAdminCanWrite,
 * 	CanSearch
 * } from 'pointyapi/bodyguards';
 * import { UserRole, UserStatus, BodyguardOwner } from 'pointyapi/enums';
 *
 * export class User extends BaseUser() {
 *		// ID
 *		@BodyguardKey() // Determine who can read/write from here
 *		@AnyoneCanRead()
 *		public id: number = undefined;
 *
 *		// Time created
 *		@AnyoneCanRead()
 *		public timeCreated: Date = undefined;
 *
 *		// Time last updated
 *		@AnyoneCanRead()
 *		public timeUpdated: Date = undefined;
 *
 *		// Username
 *		@AnyoneCanRead()
 *		@OnlySelfCanWrite()
 *		@CanSearch()
 *		public username: string = undefined;
 *
 *		// First name
 *		@AnyoneCanRead()
 *		@OnlySelfCanWrite()
 *		@CanSearch()
 *		public fname: string = undefined;
 *
 *		// User Role
 *		@OnlySelfCanRead()
 *		@OnlyAdminCanWrite()
 *		public role: UserRole = undefined;
 * }
 *
 * export class Chat extends BaseModel() {
 *		// ID
 *		@OnlySelfCanRead()
 *		public id: number = undefined;
 *
 *		// Time created
 *		@OnlySelfCanRead()
 *		public timeCreated: Date = undefined;
 *
 *		// Time last updated
 *		@OnlySelfCanRead()
 *		public timeUpdated: Date = undefined;
 *
 * 		// From User
 * 		@BodyguardKey() // Determine who can read/write from here
 * 		@OnlySelfCanRead()
 * 		public fromUserId: number = undefined;
 *
 * 		// To User
 * 		@BodyguardKey() // Determine who can read/write from here
 * 		@OnlySelfCanRead()
 * 		public toUserId: number = undefined;
 * }
 *
 * ```
 *
 */

/**
 * Bodyguard Decorators
 */
import 'reflect-metadata';
import { BodyguardOwner, UserRole } from './enums';

const CanReadSymbol = Symbol('CanRead');
const CanWriteSymbol = Symbol('CanWrite');
const BodyguardKeySymbol = Symbol('BodyguardKey');
const CanSearchSymbol = Symbol('CanSearch');
const CanSearchRelationSymbol = Symbol('CanSearchRelation');
const CanReadRelationSymbol = Symbol('CanReadRelationSymbol');

/**
 * Check if the key is a bodyguard key
 * @param target Object to test
 * @param propertyKey Key to check
 */
export function isBodyguardKey(target: any, propertyKey: string): boolean {
	return Reflect.getMetadata(BodyguardKeySymbol, target, propertyKey);
}

/**
 * Get the read privilege of the key
 * @param target Object to test
 * @param propertyKey Key to check
 */
export function getCanRead(target: any, propertyKey: string): string {
	return Reflect.getMetadata(CanReadSymbol, target, propertyKey);
}

/**
 * Get the write privilege of the key
 * @param target Object to test
 * @param propertyKey Key to check
 */
export function getCanWrite(target: any, propertyKey: string): string {
	return Reflect.getMetadata(CanWriteSymbol, target, propertyKey);
}

/**
 * Get the search privilege of the key
 * @param target Object to test
 * @param propertyKey Key to check
 */
export function getCanSearch(target: any, propertyKey: string): string {
	return Reflect.getMetadata(CanSearchSymbol, target, propertyKey);
}

/**
 * Get the search relations of the key
 * @param target Object to test
 * @param propertyKey Key to check
 */
export function getCanSearchRelation(target: any, propertyKey: string): any {
	return Reflect.getMetadata(CanSearchRelationSymbol, target, propertyKey);
}

/**
 * Get the read relations of the key
 * @param target Object to test
 * @param propertyKey Key to check
 */
export function getCanReadRelation(target: any, propertyKey: string): any {
	return Reflect.getMetadata(CanReadRelationSymbol, target, propertyKey);
}

/**
 * Bodyguard Key: This key represents ownership of the object
 * 	This might be `id` for a User, or `from` and `to` for a Chat
 * 	This key will be presented to guards and filters to determine
 * 	if the user isSelf or owns the object
 */
export function BodyguardKey() {
	return Reflect.metadata(BodyguardKeySymbol, true);
}

/**
 * Anyone can read the field
 */
export function AnyoneCanRead() {
	return Reflect.metadata(CanReadSymbol, BodyguardOwner.Anyone);
}

/**
 * Anyone can write the field
 */
export function AnyoneCanWrite() {
	return Reflect.metadata(CanWriteSymbol, BodyguardOwner.Anyone);
}

/**
 * Only owner can read the field
 */
export function OnlySelfCanRead() {
	return Reflect.metadata(CanReadSymbol, BodyguardOwner.Self);
}

/**
 * Only owner can write the field
 */
export function OnlySelfCanWrite() {
	return Reflect.metadata(CanWriteSymbol, BodyguardOwner.Self);
}

/**
 * Only admin can read the field
 */
export function OnlyAdminCanRead() {
	return Reflect.metadata(CanReadSymbol, BodyguardOwner.Admin);
}

/**
 * Only admin can write the field
 */
export function OnlyAdminCanWrite() {
	return Reflect.metadata(CanWriteSymbol, BodyguardOwner.Admin);
}

/**
 * Sets the read privilege of the field
 * @param who Who can read the field
 */
export function CanRead(who: BodyguardOwner | UserRole) {
	return Reflect.metadata(CanReadSymbol, who);
}

/**
 * Sets the write privilege of the field
 * @param who Who can read the field
 */
export function CanWrite(who: BodyguardOwner | UserRole) {
	return Reflect.metadata(CanWriteSymbol, who);
}

/**
 * Sets who can search the field
 * @param who Who can search the field. Default is anyone
 */
export function CanSearch(
	who: BodyguardOwner | UserRole = BodyguardOwner.Anyone
) {
	return Reflect.metadata(CanSearchSymbol, who);
}

/**
 * Sets who can search relations in the field
 * @param who Object with who (string) and field (array)
 *
 * {
 * 		who: BodyguardOwner.Self,
 * 		fields: [ 'username', 'fname', 'lname' ]
 * }
 */
export function CanSearchRelation(params: object) {
	return Reflect.metadata(CanSearchRelationSymbol, params);
}

/**
 * Sets who can read the relation
 * @param who Who can read the relation. Default is anyone
 */
export function CanReadRelation(
	who: BodyguardOwner | UserRole = BodyguardOwner.Anyone
) {
	return Reflect.metadata(CanReadRelationSymbol, who);
}

export { compareNestedBodyguards } from './bodyguard/compare-nested';
export { compareIdToUser } from './bodyguard/compare-id-to-user';
export { getBodyguardKeys } from './bodyguard/get-bodyguard-keys';
export { getSearchableFields } from './bodyguard/get-searchable-fields';
export { getSearchableRelations } from './bodyguard/get-searchable-relations';
export { getReadableFields } from './bodyguard/get-readable-fields';
export { getReadableRelations } from './bodyguard/get-readable-relations';

export { readFilter } from './bodyguard/read-filter';
export { writeFilter } from './bodyguard/write-filter';
