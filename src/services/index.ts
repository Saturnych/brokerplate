/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import io from './io.service';
import lab from './lab.service';
//import bots from './bots';
import auth from './auth';
//import queue from './queue';
import posts from './posts';
import products from './products';
import notify from './notify';
import api from './api';

export default {
	io,
	lab,
	//bots,
	auth,
	//queue,
	posts,
	products,
	...notify,
	...api,
};
