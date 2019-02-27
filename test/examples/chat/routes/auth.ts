import { Router } from 'express';
import { loginEndpoint, logoutEndpoint } from '../../../../src/endpoints';
import { User } from '../models/user';
import { setModel } from '../../../../src/';

const router: Router = Router();

async function loader(request, response, next) {
	if (await setModel(request, response, User, true)) {
		next();
	}
}

// Create
router.post('/', loader, loginEndpoint);
router.delete('/', loader, logoutEndpoint);

export const authRouter: Router = router;
