import { BaseUser } from '../../../../src/models';
import { ExampleRelation } from './example-relation';

import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AnyoneCanRead, OnlyAdminCanRead } from '../../../../src/bodyguard';
import { UserRole } from '../../../../src/enums';

/**
 * Foregin key test class - Owner
 */
@Entity('ExampleOwner')
export class ExampleOwner extends BaseUser {
	// ID
	@PrimaryGeneratedColumn() public id: number = undefined;

	@AnyoneCanRead() public username: string = undefined;

	@OnlyAdminCanRead() public role: UserRole = undefined;

	// ExampleRelation
	@OneToMany((type) => ExampleRelation, (relation) => relation.owner)
	public relations: ExampleRelation[] = undefined;
}
