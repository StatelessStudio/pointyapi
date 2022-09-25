import { Request, Response } from '../../../../src';
import { BaseUser } from '../../../../src/models';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BodyguardKey, AnyoneCanRead } from '../../../../src/bodyguard';

@Entity()
export class HookTestClass extends BaseUser {
	@PrimaryGeneratedColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	public id: number = undefined;

	@Column() public username: string = undefined;
	@Column() public password: string = undefined;
	@Column() public email: string = undefined;

	public async beforePost(request: Request, response: Response) {
		expect(this.id).toBe(undefined);
		expect(this.username).toBe('beforePost');
		expect(this.password).toBe('password123');

		request['hookCallback']('beforePost');

		return request['hookShouldPass'];
	}

	public async beforePatch(request: Request, response: Response) {
		expect(this.id).toBe(undefined);
		expect(this.username).toBe('patchUpdate');
		expect(this.password).toBe('updated123');

		request['hookCallback']('beforePatch');

		return request['hookShouldPass'];
	}

	public async beforeDelete(request: Request, response: Response) {
		expect(this.id).toBeGreaterThanOrEqual(1);
		expect(this.username.includes('beforeDelete')).toBe(true);
		expect(this.password).toBe('password123');

		request['hookCallback']('beforeDelete');

		return request['hookShouldPass'];
	}

	public async beforeLogin(request: Request, response: Response) {
		expect(this['__user']).toBe('testuser');
		expect(this.password).toBe('password123');

		request['hookCallback']('beforeLogin');

		return request['hookShouldPass'];
	}

	public async beforeLogout(request: Request, response: Response) {
		expect(this.id).toBeGreaterThanOrEqual(1);
		expect(this.username.includes('beforeLogout')).toBe(true);
		expect(this.password).toBe('password123');

		request['hookCallback']('beforeLogout');

		return request['hookShouldPass'];
	}

	public async delete(request: Request, response: Response) {
		expect(this.id).toBeGreaterThanOrEqual(1);
		expect(this.username.includes('delete')).toBe(true);
		expect(this.password).toBe('password123');

		request['hookCallback']('delete');

		return request['hookShouldPass'];
	}

	public async get(request: Request, response: Response) {
		expect(this.id).toBeGreaterThanOrEqual(1);
		expect(this.username.includes('get')).toBe(true);
		expect(this.password).toBe('password123');

		request['hookCallback']('get');

		return request['hookShouldPass'];
	}

	public async patch(request: Request, response: Response) {
		expect(this.id).toBeGreaterThanOrEqual(1);
		expect(this.username.includes('patch')).toBe(true);
		expect(this.password).toBe('password123');

		request['hookCallback']('patch');

		return request['hookShouldPass'];
	}

	public async post(request: Request, response: Response) {
		expect(this.username.includes('post')).toBe(true);
		expect(this.password).toBe('password123');

		request['hookCallback']('post');

		return request['hookShouldPass'];
	}

	public async login(request: Request, response: Response) {
		expect(this['__user'].includes('login')).toBe(true);
		expect(this.password).toEqual('password123');

		request['hookCallback']('login');

		return request['hookShouldPass'];
	}

	public async logout(request: Request, response: Response) {
		expect(this.id).toBeGreaterThanOrEqual(1);
		expect(this.username.includes('logout')).toBe(true);
		expect(this.password).toEqual(jasmine.any(String));

		request['hookCallback']('logout');

		return request['hookShouldPass'];
	}
}
