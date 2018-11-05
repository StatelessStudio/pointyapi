import { Router } from 'express';

import {
	postEndpoint,
	putEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';
import { User } from '../models/user';

import { setModel } from '../../../../src/';
import {
	postFilter,
	getFilter,
	putFilter,
	deleteFilter,
	onlySelf
} from '../../../../src/guards';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, User, 'id')) {
		next();
	}
}

// Create
router.post('/', loader, postFilter, postEndpoint);
router.get('/', loader, getFilter, getEndpoint);
router.put(`/:id`, loader, onlySelf, putFilter, putEndpoint);
router.delete(`/:id`, loader, onlySelf, deleteFilter, deleteEndpoint);

export const userRouter: Router = router;
