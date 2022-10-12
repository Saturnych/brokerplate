/**
 * Copyright (c) 2022
 *
 * @summary ApiService authorized /auth routes
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
		'REST posts': `${VERSION}.posts`,
	},
};

export default route;
