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

async function loader(request, response, next) {
	if (await setModel(request, response, BaseUser, 'id')) {
		next();
	}
}

// Create
router.post('/', loader, postEndpoint);
router.get('/', loader, getEndpoint);
router.put(`/:id`, loader, putEndpoint);
router.delete(`/:id`, loader, deleteEndpoint);

export const userRouter: Router = router;
