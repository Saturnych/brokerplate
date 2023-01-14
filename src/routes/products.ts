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
	path: `/${VERSION}/products`,
	whitelist: [`${VERSION}.products.*`],
	//checkHeaders: ['x-plate-user'], // X-Plate-User
	authentication: true,
	authorization: true,
	autoAliases: false,
	aliases: {
		'REST /': `${VERSION}.products`,
	},
};

export default route;
