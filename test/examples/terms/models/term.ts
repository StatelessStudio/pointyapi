import { Request, Response } from 'express';

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	ManyToMany
} from 'typeorm';

// Models
import { BaseModel } from '../../../../src/models';
import { User } from './user';

// Validation
import { Length, IsInt, IsOptional } from 'class-validator';

// Bodyguards
import {
	AnyoneCanRead,
	OnlyAdminCanWrite,
	BodyguardKey,
	CanSearch,
	CanSearchRelation,
	CanReadRelation
} from '../../../../src/bodyguard';
import { BodyguardOwner } from '../../../../src/enums';

@Entity()
export class Term extends BaseModel {
	@PrimaryGeneratedColumn()
	@AnyoneCanRead()
	public id: number = undefined;

	@ManyToOne((type) => User, (user) => user.terms, {
		eager: true
	})
	@JoinColumn()
	@BodyguardKey()
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	@CanSearchRelation({
		who: BodyguardOwner.Self,
		fields: [ 'username' ]
	})
	public author: User = undefined;

	@ManyToMany((type) => User, (user) => user.termRelations)
	@CanReadRelation()
	public users: User[] = undefined;

	@Column({ default: false })
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	public hierarchical: boolean = undefined;

	@Column({ nullable: true })
	@IsInt()
	@AnyoneCanRead()
	@OnlyAdminCanWrite()
	@IsOptional()
	public parent: number = undefined;

	@Column('text')
	@AnyoneCanRead()
	@Length(1, 250)
	@OnlyAdminCanWrite()
	@CanSearch()
	public title: string = undefined;

	@Column('text', { nullable: true })
	@AnyoneCanRead()
	@Length(1, 250)
	@OnlyAdminCanWrite()
	@IsOptional()
	public description: string = undefined;

	public async beforePost(request: Request, response: Response) {
		if (request.user) {
			this.author = request.user;

			return true;
		}
		else {
			response.unauthorizedResponder('Only admin can post');

			return false;
		}
	}
}
