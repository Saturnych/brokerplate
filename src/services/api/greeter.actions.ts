import { Context } from 'moleculer';

import { DEBUG } from '../../config/vars';

const ActionHello = (ctx: Context): string =>
	'Hello Moleculer: ' + JSON.stringify(ctx.params);

const ActionWelcome = (name: string): string => `Welcome, ${name}`;

export default {
	/**
	 * Say a 'Hello' action.
	 *
	 */
	hello: {
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
		rest: '/welcome',
		params: {
			name: 'string',
		},
		handler: async (ctx: Context<{ name: string }>): Promise<string> => {
			if (DEBUG) {
				console.log(
					'greeter.welcome() ctx.params:',
					JSON.stringify(ctx.params)
				);
			}
			return ActionWelcome(ctx.params.name);
		},
	},
};
