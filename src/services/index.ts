/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import lab from './lab.service';
import io from './io.service';
import auth from './auth';
import queue from './queue';
import posts from './posts';
import products from './products';
import notify from './notify';
import api from './api';

export default {
	lab,
	io,
	auth,
	queue,
	posts,
	products,
	...notify,
	...api,
};
