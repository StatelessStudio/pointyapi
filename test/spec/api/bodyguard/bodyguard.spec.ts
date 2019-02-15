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
	CanSearchRelation
} from '../../../../src/bodyguard';
import { BaseModel } from '../../../../src/models';

class ExampleModel extends BaseModel {
	@BodyguardKey() public bodyguardKey: number = undefined;

	@AnyoneCanRead() public anyoneCanRead: string = undefined;

	@AnyoneCanWrite() public anyoneCanWrite: string = undefined;

	@OnlySelfCanRead() public onlySelfCanRead: string = undefined;

	@OnlySelfCanWrite() public onlySelfCanWrite: string = undefined;

	@OnlyAdminCanRead() public onlyAdminCanRead: string = undefined;

	@OnlyAdminCanWrite() public onlyAdminCanWrite: string = undefined;

	@CanRead('__anyone__') public canReadAnyone: string = undefined;

	@CanWrite('__anyone__') public canWriteAnyone: string = undefined;

	@CanSearch() public canSearch: string = undefined;

	@CanSearchRelation({
		who: '__anyone__',
		fields: [ 'id' ]
	})
	public canSearchRelation: Object = {};
}
const example = new ExampleModel();

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
	it('returns "__anyone__" if the member has AnyoneCanRead', () => {
		expect(getCanRead(example, 'anyoneCanRead')).toBe('__anyone__');
	});

	it('returns "__self__" if the member has OnlySelfCanRead', () => {
		expect(getCanRead(example, 'onlySelfCanRead')).toBe('__self__');
	});

	it('returns "__admin__" if the member has OnlyAdminCanRead', () => {
		expect(getCanRead(example, 'onlyAdminCanRead')).toBe('__admin__');
	});

	it('returns parameter value if the member has CanRead', () => {
		expect(getCanRead(example, 'canReadAnyone')).toBe('__anyone__');
	});

	it('returns undefined if the member is not readable', () => {
		expect(getCanRead(example, 'bodyguardKey')).toBe(undefined);
	});
});

/**
 * getCanWrite()
 * pointyapi/bodyguard
 */
describe('getCanWrite()', () => {
	it('returns "__anyone__" if the member has AnyoneCanWrite', () => {
		expect(getCanWrite(example, 'anyoneCanWrite')).toBe('__anyone__');
	});

	it('returns "__self__" if the member has OnlySelfCanWrite', () => {
		expect(getCanWrite(example, 'onlySelfCanWrite')).toBe('__self__');
	});

	it('returns "__admin__" if the member has OnlyAdminCanWrite', () => {
		expect(getCanWrite(example, 'onlyAdminCanWrite')).toBe('__admin__');
	});

	it('returns parameter value if the member has CanWrite', () => {
		expect(getCanWrite(example, 'canWriteAnyone')).toBe('__anyone__');
	});

	it('returns undefined if the member is not writeable', () => {
		expect(getCanWrite(example, 'bodyguardKey')).toBe(undefined);
	});
});

/**
 * getCanSearch()
 * pointyapi/bodyguard
 */
describe('getCanSearch()', () => {
	it('returns "__anyone__" if the member has CanSearch', () => {
		expect(getCanSearch(example, 'canSearch')).toBe('__anyone__');
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
		expect(result.who).toEqual('__anyone__');
		expect(result.fields).toEqual(jasmine.any(Array));
	});

	it('returns undefined if the member is not searchable', () => {
		expect(getCanSearchRelation(example, 'bodyguardKey')).toBe(undefined);
	});
});
