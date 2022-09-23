/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context } from 'moleculer';

import { VERSION } from '../../config/vars';

export default {
	/**
	 * Login a username
	 */
	login: {
		version: VERSION,
		rest: {
			method: 'POST',
			path: '/login',
		},
		params: {
			email: 'email|min:7',
			password: 'string',
		},
		handler: async (
			ctx: Context<{ email: string; password: string }>
		): Promise<string> => {
			if (ctx.service.debug())
				ctx.service.logger.info(
					'auth.login() ctx.params:',
					JSON.stringify(ctx.params)
				);
			return ctx.params.email;
		},
	},
};
