import { BaseUser } from '../../../../src/models';
import { ExampleRelation } from './example-relation';

import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import {
	BodyguardKey,
	AnyoneCanRead,
	OnlyAdminCanRead
} from '../../../../src/bodyguard';
import { UserRole } from '../../../../src/enums';

/**
 * Foregin key test class - Owner
 */
@Entity()
export class ExampleOwner extends BaseUser {
	// ID
	@PrimaryGeneratedColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	public id: number = undefined;

	@Column()
	@AnyoneCanRead()
	public username: string = undefined;

	@Column({ default: UserRole.Basic })
	@OnlyAdminCanRead()
	public role: UserRole = undefined;

	@Column({ nullable: true })
	public fname: string = undefined;
	@Column({ nullable: true })
	public lname: string = undefined;

	// ExampleRelation
	@OneToMany((type) => ExampleRelation, (relation) => relation.owner)
	public relations: ExampleRelation[] = undefined;
}
