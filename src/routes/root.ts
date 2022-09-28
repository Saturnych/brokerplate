/**
 * Copyright (c) 2022
 *
 * @summary AuthService unauthorized / routes
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { VERSION } from '../config/vars';

const route = {
	path: '',
	whitelist: ['$node.*', `${VERSION}.api.*`, `${VERSION}.auth.*`],
	authentication: false,
	authorization: false,
	autoAliases: false,
	aliases: {
		health: '$node.health',
	},
};

// /v1/api/list-aliases => v1.api.listAliases
route.aliases[`GET ${VERSION}/api/health`] = `${VERSION}.api.health`;
route.aliases[`GET ${VERSION}/api/test`] = `${VERSION}.api.test`;
route.aliases[`GET ${VERSION}/auth/login`] = `${VERSION}.auth.login`;

export default route;
