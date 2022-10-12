/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API routes
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { configRoute } from '../utils';

import auth from './auth';
import posts from './posts';
import products from './products';
import root from './root';

const routes = [auth, posts, products, root];

export default routes.map((route) => configRoute(route));
