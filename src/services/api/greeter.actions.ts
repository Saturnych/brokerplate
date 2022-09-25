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

const ActionHello = (ctx: Context): string =>
	'Hello Moleculer: ' + JSON.stringify(ctx.meta);

const ActionWelcome = (name: string): string => `Welcome, ${name}`;

export default {
	/**
	 * Say a 'Hello' action.
	 *
	 */
	hello: {
		version: VERSION,
		rest: {
			method: 'GET',
			path: '/hello',
		},
		handler: async (ctx: Context): Promise<string> => ActionHello(ctx),
	},

	/**
	 * Welcome, a username
	 */
	welcome: {
		version: VERSION,
		rest: '/welcome',
		params: {
			name: 'string',
		},
		handler: async (ctx: Context<{ name: string }>): Promise<string> => {
			if (ctx.service.debug())
				ctx.service.logger.info(
					'greeter.welcome() ctx.params:',
					JSON.stringify(ctx.params)
				);
			return ActionWelcome(ctx.params.name);
		},
	},
};
