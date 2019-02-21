import { BaseModel } from '../../../../src/models';
import { ExampleOwner } from './example-owner';

import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CanSearchRelation, BodyguardKey } from '../../../../src/bodyguard';

/**
 * Foregin key test class - Resource
 */
@Entity('ExampleRelation')
export class ExampleRelation extends BaseModel {
	// ID
	@PrimaryGeneratedColumn() public id: number = undefined;

	// ExampleOwner
	@ManyToOne((type) => ExampleOwner, (owner) => owner.relations)
	@BodyguardKey()
	@CanSearchRelation({
		who: '__anyone__',
		fields: [ 'username' ]
	})
	public owner: ExampleOwner = undefined;
}
