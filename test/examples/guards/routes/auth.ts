import { Router } from 'express';

import { loginEndpoint, logoutEndpoint } from '../../../../src/endpoints';
import { ExampleUser } from '../../../../src/models/example-user';

import { setModel } from '../../../../src/';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, ExampleUser, true)) {
		next();
	}
}

// Create
router.post('/', loader, loginEndpoint);
router.delete('/', loader, logoutEndpoint);
export const authRouter: Router = router;
