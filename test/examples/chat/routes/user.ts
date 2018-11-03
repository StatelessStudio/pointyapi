import { Router } from 'express';

import {
	postEndpoint,
	putEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';
import { User } from '../models/user';

import { setModel } from '../../../../src/';
import { loadEntity, getQuery } from '../../../../src/middleware';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, User, 'id')) {
		next();
	}
}

// Create
router.post('/', loader, postEndpoint);
router.get('/', loader, getEndpoint);
router.put(`/:id`, loader, putEndpoint);
router.delete(`/:id`, loader, deleteEndpoint);

export const userRouter: Router = router;
