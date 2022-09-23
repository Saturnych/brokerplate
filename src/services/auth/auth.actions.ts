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
	 * Ping action.
	 *
	 */
	ping: {
		version: VERSION,
		params: {},
		handler: async (ctx: Context): Promise<string | unknown> => (await ctx.service.redis?.ping()),
	},

	/**
	 * Keys action.
	 *
	 */
	keys: {
		version: VERSION,
		params: {},
		handler: async (ctx: Context): Promise<Array<any> | unknown> => (await ctx.service.redis?.keys('*')),
	},

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
