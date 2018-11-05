import { Router } from 'express';

import { loginEndpoint, logoutEndpoint } from '../../../../src/endpoints';
import { BaseUser } from '../../../../src/models/base-user';

import { setModel } from '../../../../src/';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, BaseUser, 'id')) {
		next();
	}
}

// Create
router.post('/', loader, loginEndpoint);
router.delete('/', loader, logoutEndpoint);
export const authRouter: Router = router;
