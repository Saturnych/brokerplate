/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API authorized /auth routes
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { VERSION } from '../config/vars';

const route = {
	path: `/${VERSION}/posts`,
	whitelist: [`${VERSION}.posts.*`],
	//checkHeaders: ['x-plate-user'], // X-Plate-User
	authentication: true,
	authorization: true,
	autoAliases: false,
	aliases: {
		//'REST /': `${VERSION}.posts`,
		'GET /': `stream:${VERSION}.posts.list`,
		'GET /:id': `stream:${VERSION}.posts.find`,
		'POST /': `${VERSION}.posts.create`,
		'PUT /:id': `stream:${VERSION}.posts.update`,
		'DELETE /:id': `stream:${VERSION}.posts.remove`,
	},
};

export default route;
