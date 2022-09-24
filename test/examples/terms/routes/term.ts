import { Router } from 'express';

import {
	getFilter,
	postFilter,
	patchFilter
} from '../.../../../../../src/filters';
import { onlyAdmin } from '../.../../../../../src/guards';
import {
	postEndpoint,
	patchEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../.../../../../../src/endpoints';

import { setModel } from '../.../../../../../src/';
import { Term } from '../models/term';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, Term)) {
		next();
	}
}

// Create
router.post('/', loader, onlyAdmin, postFilter, postEndpoint);
router.get('/', loader, getFilter, getEndpoint);
router.patch('/:id', loader, onlyAdmin, patchFilter, patchEndpoint);
router.delete('/:id', loader, onlyAdmin, deleteEndpoint);

export const termRouter: Router = router;
