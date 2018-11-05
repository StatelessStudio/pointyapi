/**
 * # Bodyguards
 *
 * Bodyguards are guards that operate on the body (*request.query,
 * request.body, response.body*).  Bodyguards come in two forms:
 * - Guards
 *	- Bodyguard Guards block incoming requests, e.g. a basic user
 *	who tries to change his own role
 * - Filters
 *	- Bodyguard Filter removes sensitive fields from response bodies
 *
 * ## Decorators
 *
 * Decorators are used to set read/write privelages on your model.  There
 * are several decorators already available for you:
 * - Read
 *  - CanRead(who?)
 *  - AnyoneCanRead
 *  - OnlySelfCanRead
 *  - OnlyAdminCanRead
 * - Write
 *  - CanWrite(who?)
 *  - AnyoneCanWrite
 *  - OnlySelfCanWrite
 *  - OnlyAdminCanWrite
 * - Search
 *  - CanSearch(who?)
 *
 * **NOTE: Any members without a read or write decorator will NOT be
 * permitted under any circumstance.**
 *
 * Decorators which take a *who* parameter default to anyone but also
 * can take a UserRole, or (`__anyone__`, `__self__`, `__admin__`)
 *
 * ### BodyguardKey
 *
 * There is one additional decorator: `BodyguardKey`.  This key will be
 * presented to the bodyguard to gain authorization.  For example, the
 * `userId` of a User would be the BodyguardKey, or the `fromUserId` and
 * `toUserId` would be the BodyguardKeys on a Chat model.  When the
 * bodyguard runs, it will compare the authenticated user with the
 * BodyguardKey of the object.
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
 *		// Time last accessed
 *		@AnyoneCanRead()
 *		public timeAccessed: Date = undefined;
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
 *		// Time last accessed
 *		@OnlySelfCanRead()
 *		public timeAccessed: Date = undefined;
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

export function isBodyguardKey(target: any, propertyKey: string) {
	return Reflect.getMetadata(BodyguardKeySymbol, target, propertyKey);
}

export function getCanRead(target: any, propertyKey: string) {
	return Reflect.getMetadata(CanReadSymbol, target, propertyKey);
}

export function getCanWrite(target: any, propertyKey: string) {
	return Reflect.getMetadata(CanWriteSymbol, target, propertyKey);
}

export function getCanSearch(target: any, propertyKey: string) {
	return Reflect.getMetadata(CanSearchSymbol, target, propertyKey);
}

export function BodyguardKey() {
	return Reflect.metadata(BodyguardKeySymbol, true);
}

export function AnyoneCanRead() {
	return Reflect.metadata(CanReadSymbol, '__anyone__');
}

export function AnyoneCanWrite() {
	return Reflect.metadata(CanWriteSymbol, '__anyone__');
}

export function OnlySelfCanRead() {
	return Reflect.metadata(CanReadSymbol, '__self__');
}

export function OnlySelfCanWrite() {
	return Reflect.metadata(CanWriteSymbol, '__self__');
}

export function OnlyAdminCanRead() {
	return Reflect.metadata(CanReadSymbol, '__admin__');
}

export function OnlyAdminCanWrite() {
	return Reflect.metadata(CanWriteSymbol, '__admin__');
}

export function CanRead(who: string) {
	return Reflect.metadata(CanReadSymbol, who);
}

export function CanWrite(who: string) {
	return Reflect.metadata(CanWriteSymbol, who);
}

export function CanSearch(who: string = '__anyone__') {
	return Reflect.metadata(CanSearchSymbol, who);
}

export { isAdmin } from './bodyguard/is-admin';
export { isSelf } from './bodyguard/is-self';

export { compareNestedBodyguards } from './bodyguard/compare-nested';
export { compareIdToUser } from './bodyguard/compare-id-to-user';
export { getBodyguardKeys } from './bodyguard/get-bodyguard-keys';
export { getSearchableFields } from './bodyguard/get-searchable-fields';

export { responseFilter } from './bodyguard/response-filter';
export { writeFilter } from './bodyguard/write-filter';
