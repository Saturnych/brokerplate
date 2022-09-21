import { Context } from 'moleculer';

const ActionHello = (ctx: Context): string =>
	'Hello Moleculer: ' + JSON.stringify(ctx.params);

const ActionWelcome = (name: string): string => `Welcome, ${name}`;

export default {
	/**
	 * Say a 'Hello' action.
	 *
	 */
	health: {
		rest: {
			method: 'GET',
			path: '/health',
		},
		handler: async (ctx: Context): Promise<string> => {
      if (ctx.service.debug()) ctx.service.logger.info('greeter.health()');
      return JSON.stringify({
        name: ctx.service.initial().name,
        state: ctx.service.state(),
        uptime: process && process.uptime(),
        timestamp: Date.now(),
      });
    },
	},
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
			if (ctx.service.debug()) ctx.service.logger.info('greeter.welcome() ctx.params:', JSON.stringify(ctx.params));
			return ActionWelcome(ctx.params.name);
		},
	},
};
