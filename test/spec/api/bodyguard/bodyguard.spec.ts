import {
	isBodyguardKey,
	getCanRead,
	getCanWrite,
	getCanSearch,
	getCanSearchRelation,
	BodyguardKey,
	AnyoneCanRead,
	AnyoneCanWrite,
	OnlySelfCanRead,
	OnlySelfCanWrite,
	OnlyAdminCanRead,
	OnlyAdminCanWrite,
	CanRead,
	CanWrite,
	CanSearch,
	CanSearchRelation,
	CanReadAll,
	CanWriteAll,
	getCanReadAll,
	getCanWriteAll
} from '../../../../src/bodyguard';
import { BaseModel } from '../../../../src/models';
import { BodyguardOwner, UserRole } from '../../../../src/enums';

class ExampleModel extends BaseModel {
	@BodyguardKey() public bodyguardKey: number = undefined;

	@AnyoneCanRead() public anyoneCanRead: string = undefined;

	@AnyoneCanWrite() public anyoneCanWrite: string = undefined;

	@OnlySelfCanRead() public onlySelfCanRead: string = undefined;

	@OnlySelfCanWrite() public onlySelfCanWrite: string = undefined;

	@OnlyAdminCanRead() public onlyAdminCanRead: string = undefined;

	@OnlyAdminCanWrite() public onlyAdminCanWrite: string = undefined;

	@CanRead(BodyguardOwner.Anyone) public canReadAnyone: string = undefined;

	@CanWrite(BodyguardOwner.Anyone) public canWriteAnyone: string = undefined;

	@CanSearch() public canSearch: string = undefined;

	@CanSearchRelation({
		who: BodyguardOwner.Anyone,
		fields: [ 'id' ]
	})
	public canSearchRelation: Object = {};
}
const example = new ExampleModel();

@CanReadAll()
class ExampleReadableModel extends BaseModel {
	public testField1: string = undefined;
}
const exampleReadable = new ExampleReadableModel();

@CanWriteAll()
class ExampleWritableModel extends BaseModel {
	public testField1: string = undefined;
}
const exampleWritable = new ExampleWritableModel();

@CanReadAll(UserRole.Admin)
class AdminReadableModel extends BaseModel {
	public testField1: string = undefined;
}
const adminReadable = new AdminReadableModel();

@CanWriteAll(UserRole.Admin)
class AdminWritableModel extends BaseModel {
	public testField1: string = undefined;
}
const adminWritable = new AdminWritableModel();

@CanReadAll()
class MixedReadableModel extends BaseModel {
	public anyoneCanReadThisField: string = undefined;

	@CanRead(UserRole.Admin)
	public butOnlyAdminCanReadThisOne: string = undefined;
}
const mixedReadable = new MixedReadableModel();

@CanWriteAll()
class MixedWritableModel extends BaseModel {
	public anyoneCanWriteThisField: string = undefined;

	@CanWrite(UserRole.Admin)
	public butOnlyAdminCanWriteThisOne: string = undefined;
}
const mixedWritable = new MixedWritableModel();

/**
 * getCanReadAll()
 * pointyapi/bodyguard
 */
describe('getCanReadAll()', () => {
	it('returns anyone if no parameter is set', () => {
		expect(getCanReadAll(exampleReadable)).toEqual(BodyguardOwner.Anyone);
	});

	it('returns role if set as parameter', () => {
		expect(getCanReadAll(adminReadable)).toEqual(UserRole.Admin);
	});
});

/**
 * getCanWriteAll()
 * pointyapi/bodyguard
 */
describe('getCanWriteAll()', () => {
	it('returns anyone if no parameter is set', () => {
		expect(getCanWriteAll(exampleWritable)).toEqual(BodyguardOwner.Anyone);
	});

	it('returns role if set as parameter', () => {
		expect(getCanWriteAll(adminWritable)).toEqual(UserRole.Admin);
	});
});

/**
 * isBodyguardKey()
 * pointyapi/bodyguard
 */
describe('isBodyguardKey()', () => {
	it('returns true if the member is a BodyguardKey', () => {
		expect(isBodyguardKey(example, 'bodyguardKey')).toBe(true);
	});

	it('returns undefined if the member is not a BodyguardKey', () => {
		expect(isBodyguardKey(example, 'anyoneCanRead')).toBe(undefined);
	});
});

/**
 * getCanRead()
 * pointyapi/bodyguard
 */
describe('getCanRead()', () => {
	it('returns "BodyguardOwner.Admin" if the member has AnyoneCanRead', () => {
		expect(getCanRead(example, 'anyoneCanRead')).toBe(
			BodyguardOwner.Anyone
		);
	});

	it('returns "BodyguardOwner.Self" if the member has OnlySelfCanRead', () => {
		expect(getCanRead(example, 'onlySelfCanRead')).toBe(
			BodyguardOwner.Self
		);
	});

	it('returns "BodyguardOwner.Admin" if the member has OnlyAdminCanRead', () => {
		expect(getCanRead(example, 'onlyAdminCanRead')).toBe(
			BodyguardOwner.Admin
		);
	});

	it('returns parameter value if the member has CanRead', () => {
		expect(getCanRead(example, 'canReadAnyone')).toBe(
			BodyguardOwner.Anyone
		);
	});

	it('returns anyone if the class has CanReadAll()', () => {
		expect(getCanRead(mixedReadable, 'anyoneCanReadThisField')).toEqual(
			BodyguardOwner.Anyone
		);
	});

	it('returns UserRole.Admin if CanReadAll() has been overridden', () => {
		expect(getCanRead(mixedReadable, 'butOnlyAdminCanReadThisOne')).toEqual(
			UserRole.Admin
		);
	});
});

/**
 * getCanWrite()
 * pointyapi/bodyguard
 */
describe('getCanWrite()', () => {
	it('returns "BodyguardOwner.Admin" if the member has AnyoneCanWrite', () => {
		expect(getCanWrite(example, 'anyoneCanWrite')).toBe(
			BodyguardOwner.Anyone
		);
	});

	it('returns "BodyguardOwner.Self" if the member has OnlySelfCanWrite', () => {
		expect(getCanWrite(example, 'onlySelfCanWrite')).toBe(
			BodyguardOwner.Self
		);
	});

	it('returns BodyguardOwner.Admin on OnlyAdminCanWrite', () => {
		expect(getCanWrite(example, 'onlyAdminCanWrite')).toBe(
			BodyguardOwner.Admin
		);
	});

	it('returns parameter value if the member has CanWrite', () => {
		expect(getCanWrite(example, 'canWriteAnyone')).toBe(
			BodyguardOwner.Anyone
		);
	});

	it('returns undefined if the member is not writeable', () => {
		expect(getCanWrite(example, 'bodyguardKey')).toBe(undefined);
	});

	it('returns anyone if the class has CanWriteAll()', () => {
		expect(getCanWrite(mixedWritable, 'anyoneCanWriteThisField')).toEqual(
			BodyguardOwner.Anyone
		);
	});

	it('returns UserRole.Admin if CanWriteAll() has been overridden', () => {
		expect(
			getCanWrite(mixedWritable, 'butOnlyAdminCanWriteThisOne')
		).toEqual(UserRole.Admin);
	});
});

/**
 * getCanSearch()
 * pointyapi/bodyguard
 */
describe('getCanSearch()', () => {
	it('returns "BodyguardOwner.Admin" if the member has CanSearch', () => {
		expect(getCanSearch(example, 'canSearch')).toBe(BodyguardOwner.Anyone);
	});

	it('returns undefined if the member is not searchable', () => {
		expect(getCanSearch(example, 'bodyguardKey')).toBe(undefined);
	});
});

/**
 * getCanSearchRelation()
 * pointyapi/bodyguard
 */
describe('getCanSearchRelation()', () => {
	it('returns who & fields if the member has CanSearchRelation', () => {
		const result = getCanSearchRelation(example, 'canSearchRelation');

		expect(result).toEqual(jasmine.any(Object));
		expect(result.who).toEqual(BodyguardOwner.Anyone);
		expect(result.fields).toEqual(jasmine.any(Array));
	});

	it('returns undefined if the member is not searchable', () => {
		expect(getCanSearchRelation(example, 'bodyguardKey')).toBe(undefined);
	});
});
