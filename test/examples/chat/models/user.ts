import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChatMessage } from './chat-message';

// Validation
import {
	IsUrl,
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
	CanSearch,
	CanReadRelation
} from '../../../../src/bodyguard';

// Models
import { BaseUser } from '../../../../src/models';
import { UserRole, UserStatus } from '../../../../src/enums';

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

	// Time last updated
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@AnyoneCanRead()
	public timeUpdated: Date = undefined;

	// Access token (jwt)
	@Column({ nullable: true })
	public token: string = undefined;

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
	@IsEmail()
	@IsOptional()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	@CanSearch()
	public email: string = undefined;

	// Email (temporary)
	@Column({ nullable: true })
	@IsEmail()
	@IsOptional()
	@OnlySelfCanWrite()
	public tempEmail: string = undefined;

	// Password
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanWrite()
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
	// TODO: Validate
	@Column({ type: 'text', nullable: true })
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public biography: string = undefined;

	// Geographical Location
	@Column({ nullable: true })
	@Length(1, 250)
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public location: string = undefined;

	// Thumbnail image
	@Column({ nullable: true })
	@IsUrl({ allow_protocol_relative_urls: true })
	@IsOptional()
	@AnyoneCanRead()
	@OnlySelfCanWrite()
	public thumbnail: string = undefined;

	// Chat Message (Sent)
	@OneToMany((type) => ChatMessage, (chat) => chat.from)
	@CanReadRelation('__self__')
	public outbox: ChatMessage[] = undefined;

	// Chat Message (Received)
	@OneToMany((type) => ChatMessage, (chat) => chat.to)
	@CanReadRelation('__self__')
	public inbox: ChatMessage[] = undefined;
}
