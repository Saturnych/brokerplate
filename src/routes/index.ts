/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API routes
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { configRoute } from '../utils';

import auth from './auth';
import file from './file';
import posts from './posts';
import products from './products';
import root from './root';

const routes = [auth, file, posts, products, root];

export default routes.map((route) => configRoute(route));
