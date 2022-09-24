import { Router } from 'express';

import {
	postEndpoint,
	patchEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';
import { ExampleUser } from '../../../../src/models/example-user';

import { setModel } from '../../../../src/';

import { postFilter, getFilter, patchFilter } from '../../../../src/filters';
import { onlySelf } from '../../../../src/guards';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, ExampleUser)) {
		next();
	}
}

// Create
router.post('/', loader, postFilter, postEndpoint);
router.get('/', loader, getFilter, getEndpoint);
router.patch('/:id', loader, onlySelf, patchFilter, patchEndpoint);
router.delete('/:id', loader, onlySelf, deleteEndpoint);

export const userRouter: Router = router;
