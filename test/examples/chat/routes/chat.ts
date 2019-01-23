import { Router } from 'express';

import {
	postFilter,
	getFilter,
	putFilter,
	onlySelf
} from '../../../../src/guards';

import {
	postEndpoint,
	putEndpoint,
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
router.put(`/:id`, loader, onlySelf, putFilter, putEndpoint);
router.delete(`/:id`, loader, onlySelf, deleteEndpoint);

export const chatRouter: Router = router;
