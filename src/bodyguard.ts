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
 * can take a UserRole, or (`__anyone__`, `__self__`, `__admin__`)
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
 *		// Access token (jwt)
 *		// NO BODYGUARD, NO READ/WRITE
 *		public token: string = undefined;
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

const CanReadSymbol = Symbol('CanRead');
const CanWriteSymbol = Symbol('CanWrite');
const BodyguardKeySymbol = Symbol('BodyguardKey');
const CanSearchSymbol = Symbol('CanSearch');
const CanSearchRelationSymbol = Symbol('CanSearchRelation');

/**
 * Check if the key is a bodyguard key
 * @param target any Object to test
 * @param propertyKey string Key to check
 */
export function isBodyguardKey(target: any, propertyKey: string): boolean {
	return Reflect.getMetadata(BodyguardKeySymbol, target, propertyKey);
}

/**
 * Get the read privilege of the key
 * @param target any Object to test
 * @param propertyKey string Key to check
 */
export function getCanRead(target: any, propertyKey: string): string {
	return Reflect.getMetadata(CanReadSymbol, target, propertyKey);
}

/**
 * Get the write privilege of the key
 * @param target any Object to test
 * @param propertyKey string Key to check
 */
export function getCanWrite(target: any, propertyKey: string): string {
	return Reflect.getMetadata(CanWriteSymbol, target, propertyKey);
}

/**
 * Get the search privilege of the key
 * @param target any Object to test
 * @param propertyKey string Key to check
 */
export function getCanSearch(target: any, propertyKey: string): string {
	return Reflect.getMetadata(CanSearchSymbol, target, propertyKey);
}

/**
 * Get the search relations of the key
 * @param target any Object to test
 * @param propertyKey string Key to check
 */
export function getCanSearchRelation(target: any, propertyKey: string): any {
	return Reflect.getMetadata(CanSearchRelationSymbol, target, propertyKey);
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
	return Reflect.metadata(CanReadSymbol, '__anyone__');
}

/**
 * Anyone can write the field
 */
export function AnyoneCanWrite() {
	return Reflect.metadata(CanWriteSymbol, '__anyone__');
}

/**
 * Only owner can read the field
 */
export function OnlySelfCanRead() {
	return Reflect.metadata(CanReadSymbol, '__self__');
}

/**
 * Only owner can write the field
 */
export function OnlySelfCanWrite() {
	return Reflect.metadata(CanWriteSymbol, '__self__');
}

/**
 * Only admin can read the field
 */
export function OnlyAdminCanRead() {
	return Reflect.metadata(CanReadSymbol, '__admin__');
}

/**
 * Only admin can write the field
 */
export function OnlyAdminCanWrite() {
	return Reflect.metadata(CanWriteSymbol, '__admin__');
}

/**
 * Sets the read privilege of the field
 * @param who Who can read the field (`__anyone__`, `__self__`, `__admin__`)
 */
export function CanRead(who: string) {
	return Reflect.metadata(CanReadSymbol, who);
}

/**
 * Sets the write privilege of the field
 * @param who Who can read the field (`__anyone__`, `__self__`, `__admin__`)
 */
export function CanWrite(who: string) {
	return Reflect.metadata(CanWriteSymbol, who);
}

/**
 * Sets who can search the field
 * @param who string (Optional) Default is anyone
 */
export function CanSearch(who: string = '__anyone__') {
	return Reflect.metadata(CanSearchSymbol, who);
}

/**
 * Sets who can search relations in the field
 * @param who Object Object with who (string) and field (array)
 *
 * {
 * 		who: '__self__',
 * 		fields: [ 'username', 'fname', 'lname' ]
 * }
 */
export function CanSearchRelation(params: object) {
	return Reflect.metadata(CanSearchRelationSymbol, params);
}

export { isAdmin } from './bodyguard/is-admin';
export { isSelf } from './bodyguard/is-self';

export { compareNestedBodyguards } from './bodyguard/compare-nested';
export { compareIdToUser } from './bodyguard/compare-id-to-user';
export { getBodyguardKeys } from './bodyguard/get-bodyguard-keys';
export { getSearchableFields } from './bodyguard/get-searchable-fields';
export { getSearchableRelations } from './bodyguard/get-searchable-relations';
export { getReadableFields } from './bodyguard/get-readable-fields';

export { responseFilter } from './bodyguard/response-filter';
export { writeFilter } from './bodyguard/write-filter';
