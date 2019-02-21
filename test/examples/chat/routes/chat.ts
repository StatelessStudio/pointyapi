import { Router } from 'express';

import {
	postFilter,
	getFilter,
	patchFilter,
	onlySelf
} from '../../../../src/guards';

import {
	postEndpoint,
	patchEndpoint,
	deleteEndpoint,
	getEndpoint
} from '../../../../src/endpoints';

import { setModel } from '../../../../src/';
import { ChatMessage } from '../models/chat-message';
const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, ChatMessage)) {
		next();
	}
}

// Create
router.post('/', loader, onlySelf, postFilter, postEndpoint);
router.get('/', loader, onlySelf, getFilter, getEndpoint);
router.patch(`/:id`, loader, onlySelf, patchFilter, patchEndpoint);
router.delete(`/:id`, loader, onlySelf, deleteEndpoint);

export const chatRouter: Router = router;
