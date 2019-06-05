import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToMany,
	JoinTable
} from 'typeorm';
import {
	Length,
	IsAlphanumeric,
	IsDate,
	IsOptional,
	Matches
} from 'class-validator';

import {
	BodyguardKey,
	AnyoneCanRead,
	OnlySelfCanRead,
	OnlySelfCanWrite,
	OnlyAdminCanWrite,
	CanSearch,
	CanReadRelation
} from '../../../../src/bodyguard';

import { BaseUser } from '../../../../src/models';
import { UserRole, UserStatus, BodyguardOwner } from '../../../../src/enums';

import { Term } from './term';

@Entity('User')
export class User extends BaseUser {
	// ID
	@PrimaryGeneratedColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	public id: number = undefined;

	// Time created
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeCreated: Date = undefined;

	// Time last accessed
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeUpdated: Date = undefined;

	// Username
	@Column({ unique: true })
	@Length(4, 16)
	@IsAlphanumeric()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public username: string = undefined;

	// First name
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public fname: string = undefined;

	// Last name
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public lname: string = undefined;

	// Email
	@Column({ nullable: true, unique: true })
	@Matches(/^\w+@[0-9a-zA-Z_]+?\.[a-zA-Z]+$/i)
	@IsOptional()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public email: string = undefined;

	// Email (temporary)
	@Column({ nullable: true })
	@Matches(/^\w+@[0-9a-zA-Z_]+?\.[a-zA-Z]+$/i)
	@IsOptional()
	@OnlySelfCanWrite()
	@OnlySelfCanWrite()
	public tempEmail: string = undefined;

	// Password
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanWrite()
	@Matches(/[A-za-z0-9!@#$%^&*()-_+={};:'",<.>/?]{8,20}/)
	public password: string = undefined;

	// Password (temporary)
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanWrite()
	public tempPassword: string = undefined;

	// BaseUser Role
	@Column({ default: UserRole.Basic })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public role: UserRole = undefined;

	// BaseUser Status
	@Column({ default: UserStatus.Pending })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public status: UserStatus = undefined;

	// Biography
	@Column({ type: 'text', nullable: true })
	@Length(1, 5000)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public biography: string = undefined;

	@OneToMany((type) => Term, (term) => term.author)
	public terms: Term[] = undefined;

	@ManyToMany((type) => Term, (term) => term.users)
	@JoinTable()
	@CanReadRelation()
	@OnlySelfCanWrite()
	public termRelations: Term[] = undefined;
}
