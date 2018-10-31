import { Router } from 'express';

import { loginEndpoint } from '../../../../src/endpoints';
import { BaseUser } from '../../../../src/models/base-user';

import { setModel } from '../../../../src/';

const router: Router = Router();

router.use((request, response, next) => {
	setModel(request, response, BaseUser, 'id');
	next();
});

// Create
router.post('/', loginEndpoint);

export const authRouter: Router = router;
