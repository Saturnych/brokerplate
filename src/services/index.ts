/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import lab from './lab.service';
import api from './api';
import posts from './posts';
import products from './products';

export default {
	lab,
	posts,
	products,
	...api,
};
