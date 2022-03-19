import { Router } from 'express';

import {
	getFilter,
	postFilter,
	patchFilter
} from '../.../../../../../src/filters';
import { onlySelf } from '../.../../../../../src/guards';
import {
	postEndpoint,
	patchEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../.../../../../../src/endpoints';

import { setModel } from '../.../../../../../src/';
import { User } from '../models/user';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, User)) {
		next();
	}
}

// Create
router.post('/', loader, postFilter, postEndpoint);
router.get('/', loader, getFilter, getEndpoint);
router.patch('/:id', loader, onlySelf, patchFilter, patchEndpoint);
router.delete('/:id', loader, onlySelf, deleteEndpoint);

export const userRouter: Router = router;
