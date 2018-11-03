import { Router } from 'express';

import { loginEndpoint } from '../../../../src/endpoints';
import { User } from '../models/user';

import { setModel } from '../../../../src/';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, User)) {
		next();
	}
}

// Create
router.post('/', loader, loginEndpoint);

export const authRouter: Router = router;
