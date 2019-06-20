import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Validation
import {
	Length,
	IsEmail,
	IsAlphanumeric,
	IsDate,
	IsOptional
} from 'class-validator';

// Bodyguards
import {
	AnyoneCanRead,
	OnlySelfCanRead,
	OnlySelfCanWrite,
	OnlyAdminCanWrite,
	BodyguardKey,
	CanSearch
} from '../bodyguard';

// Models
import { BaseUser } from './base-user';
import { UserRole, UserStatus } from '../enums';

/**
 * Base User
 */
@Entity('User')
export class ExampleUser extends BaseUser {
	// ID
	@PrimaryGeneratedColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	public id: any = undefined;

	// Time created
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeCreated: Date = undefined;

	// Time last updated
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
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public fname: string = undefined;

	// Last name
	@Column({ nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public lname: string = undefined;

	// Email
	@Column({ nullable: true, unique: true })
	@IsEmail()
	@IsOptional()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public email: string = undefined;

	// Password
	@Column({ nullable: true })
	@OnlySelfCanWrite()
	public password: string = undefined;

	// ExampleUser Role
	@Column({ default: UserRole.Basic })
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public role: UserRole = undefined;

	// ExampleUser Status
	@Column({ default: UserStatus.Pending })
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public status: UserStatus = undefined;

	// Biography
	@Column({ type: 'text', nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public biography: string = undefined;

	// Geographical Location
	@Column({ nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public location: string = undefined;

	// Thumbnail image
	@Column({ nullable: true })
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public thumbnail: string = undefined;
}
