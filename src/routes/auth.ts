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
	path: `/${VERSION}/auth`,
	whitelist: [`${VERSION}.auth.*`],
	authentication: true,
	authorization: true,
	autoAliases: false,
	aliases: {
		'POST access': `${VERSION}.auth.access`,
		'POST recover': `${VERSION}.auth.recover`,
		'POST token': `${VERSION}.auth.token`,
		'POST updatePassword': `${VERSION}.auth.updatePassword`,
		'POST logout': `${VERSION}.auth.logout`,
	},
};

export default route;
