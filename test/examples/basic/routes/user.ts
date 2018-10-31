import { Router } from 'express';

import {
	postEndpoint,
	putEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';
import { BaseUser } from '../../../../src/models/base-user';

import { setModel } from '../../../../src/';

const router: Router = Router();

router.use((request, response, next) => {
	setModel(request, response, BaseUser, 'id');
	next();
});

// Create
router.post('/', postEndpoint);
router.get('/', getEndpoint);
router.put(`/:id`, putEndpoint);
router.delete(`/:id`, deleteEndpoint);

export const userRouter: Router = router;
