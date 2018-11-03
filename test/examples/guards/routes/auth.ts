import { Router } from 'express';

import { loginEndpoint } from '../../../../src/endpoints';
import { BaseUser } from '../../../../src/models/base-user';

import { setModel } from '../../../../src/';

const router: Router = Router();

router.use(async (request, response, next) => {
	await setModel(request, response, BaseUser);
	next();
});

// Create
router.post('/', loginEndpoint);

export const authRouter: Router = router;
