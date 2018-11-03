// Typeorm Columns
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn
} from 'typeorm';

// Validation
import { Length, IsDate, IsOptional } from 'class-validator';

// Bodyguards
import {
	AnyoneCanRead,
	OnlySelfCanRead,
	OnlySelfCanWrite,
	OnlyAdminCanWrite,
	BodyguardKey,
	CanSearch
} from '../../../../src/bodyguard';

// Models
import { BaseModel } from '../../../../src/models';
import { User } from './user';
import { ChatStatus } from '../enums/chat-status';
import { Request, Response } from 'express';

@Entity('ChatMessage')
export class ChatMessage extends BaseModel {
	// ID
	@PrimaryGeneratedColumn()
	@AnyoneCanRead()
	public id: number = undefined;

	// From User
	@ManyToOne((type) => User, (user) => user.outbox, { onDelete: 'CASCADE' })
	@JoinColumn()
	@BodyguardKey()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	public from: User = undefined;

	// To User
	@ManyToOne((type) => User, (user) => user.inbox, { onDelete: 'CASCADE' })
	@JoinColumn()
	@BodyguardKey()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	public to: User = undefined;

	// Time created
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@OnlySelfCanRead()
	public timeCreated: Date = undefined;

	// Time last accessed
	@Column({ type: 'timestamp', default: new Date() })
	@IsDate()
	@IsOptional()
	@OnlySelfCanRead()
	public timeAccessed: Date = undefined;

	// Message body
	// TODO: Validate
	@Column({ type: 'text' })
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	@CanSearch('__self__')
	public body: string = undefined;

	// User Status
	@Column({ default: ChatStatus.Unread })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	public fromStatus: ChatStatus = undefined;

	// User Status
	@Column({ default: ChatStatus.Unread })
	@Length(1, 250)
	@IsOptional()
	@OnlySelfCanRead()
	@OnlySelfCanWrite()
	public toStatus: ChatStatus = undefined;

	public onBeforePost(request: Request, response: Response) {
		if (request.user) {
			this.from = request.user;

			return true;
		}
		else {
			response.unauthorizedResponder('User not authenticated', response);
		}
	}
}
