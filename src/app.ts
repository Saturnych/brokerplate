/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API app
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { NODE_ENV, APP_NAME, VERSION } from './config/vars';

import broker from './broker';

broker.logger.info(
	`++++ ${APP_NAME.toUpperCase()}.${VERSION.toUpperCase()} in '${NODE_ENV}' mode app ++++`
);
