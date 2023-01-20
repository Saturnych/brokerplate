/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import serveStatic from 'serve-static';
import { DEBUG } from '../config/vars';

export default [
	compression(),
	cookieParser(),
	helmet(),
	serveStatic(path.join(__dirname, '../../public')),
	function (err, req, res, next) {
		const ctx = res.$ctx;
		if (DEBUG) ctx.logger.error('Error is occured in middlewares!');
		ctx.sendError(req, res, err);
	},
];
