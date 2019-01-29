import { BaseUser } from '../../../../src/models';
import { ExampleRelation } from './example-relation';

import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

/**
 * Foregin key test class - Owner
 */
@Entity('ExampleOwner')
export class ExampleOwner extends BaseUser {
	// ID
	@PrimaryGeneratedColumn() public id: number = undefined;

	// ExampleRelation
	@OneToMany((type) => ExampleRelation, (relation) => relation.owner)
	public relations: ExampleRelation[] = undefined;
}
