import {Context} from 'moleculer';

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
      if (ctx.service.debug()) ctx.service.logger.info('auth.health()');
      return JSON.stringify({
        name: ctx.service.initial().name,
        state: ctx.service.state(),
        uptime: process && process.uptime(),
        timestamp: Date.now(),
      });
    },
	},
	/**
	 * Login a username
	 */
	login: {
		rest: {
			method: 'POST',
			path: '/login',
		},
		params: {
			email: 'email|min:7',
			password: 'string',
		},
		handler: async (ctx: Context<{ email: string, password: string }>): Promise<string> => {
			if (ctx.service.debug()) ctx.service.logger.info('auth.login() ctx.params:', JSON.stringify(ctx.params));
			return ctx.params.email;
		},
	},
};
