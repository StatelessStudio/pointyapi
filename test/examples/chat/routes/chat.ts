import { Router } from 'express';

// TODO: Add guards
/* import {
	onlySelf,
	deleteGuard,
	getGuard,
	postGuard,
	putGuard
} from 'pointyapi/guards'; */

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
router.post('/', loader, postEndpoint);
router.get('/', loader, getEndpoint);
router.put(`/:id`, loader, putEndpoint);
router.delete(`/:id`, loader, deleteEndpoint);

export const chatRouter: Router = router;
