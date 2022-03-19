import { Router } from 'express';

import {
	postEndpoint,
	patchEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';
import { ExampleUser } from '../../../../src/models/example-user';

import { setModel } from '../../../../src/';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, ExampleUser)) {
		next();
	}
}

// Create
router.post('/', loader, postEndpoint);
router.get('/', loader, getEndpoint);
router.patch('/:id', loader, patchEndpoint);
router.delete('/:id', loader, deleteEndpoint);

export const userRouter: Router = router;
