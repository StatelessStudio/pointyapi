import { Router } from 'express';

import {
	postEndpoint,
	putEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';
import { BaseUser } from '../../../../src/models/base-user';

import { setModel } from '../../../../src/';
import { loadEntity, getQuery } from '../../../../src/middleware';

const router: Router = Router();

router.use((request, response, next) => {
	setModel(request, response, BaseUser, 'id');
	next();
});

// Create
router.post('/', postEndpoint);
router.get('/', getQuery, getEndpoint);
router.put(`/:id`, loadEntity, putEndpoint);
router.delete(`/:id`, loadEntity, deleteEndpoint);

export const userRouter: Router = router;
