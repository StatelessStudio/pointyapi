import { BaseUser } from '../models';
import { UserRole } from '../enums';

/**
 * Check if the user is an admin
 * @param user User object to check
 * @return Returns if the user has a role & it is UserRole.Admin
 */
export function isAdmin(user: BaseUser): boolean {
	return user && 'role' in user && user.role === UserRole.Admin;
}
