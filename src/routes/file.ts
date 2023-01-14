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
	path: `/${VERSION}/file`,
	whitelist: [`${VERSION}.file.*`],
	authentication: false, // true
	authorization: false, // true,
	autoAliases: false,
	aliases: {
		'POST /': `multipart:${VERSION}.file.multi`,
		'PUT /': `stream:${VERSION}.file.upload`,
		'GET /': `stream:${VERSION}.file.get`,
	},
	// Route level busboy config.
	// More info: https://github.com/mscdex/busboy#busboy-methods
	busboyConfig: {
			limits: { files: 1 }
			// Can be defined limit event handlers
			// `onPartsLimit`, `onFilesLimit` or `onFieldsLimit`
	},
};

export default route;
