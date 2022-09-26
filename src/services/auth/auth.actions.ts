/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import jwt from 'jsonwebtoken';
import { Errors, Context } from 'moleculer';
import { User } from '../../types';
import { checkService, validateEmail } from '../../utils';
import { VERSION } from '../../config/vars';

export default {
	/**
	 * Ping action.
	 *
	 */
	ping: {
		version: VERSION,
		params: {},
		handler: async (ctx: Context): Promise<string | unknown> =>
			await ctx.service.redis?.ping(),
	},

	/**
	 * Keys action.
	 *
	 */
	keys: {
		version: VERSION,
		params: {},
		handler: async (ctx: Context): Promise<Array<any> | unknown> =>
			await ctx.service.redis?.keys('*'),
	},

	/**
	 * Token action.
	 *
	 */
	token: {
		version: VERSION,
		params: {
			user: 'object|optional',
	    token: 'string|optional',
	    action: 'string|optional',
	    type: 'string|optional',
	    setToken: 'boolean|optional',
		},
		handler: async (ctx: Context<{ token: string; path: string }>): Promise<any> => {
			if (ctx.service.debug())
				ctx.service.logger.info(
					'auth.token() ctx.params:',
					JSON.stringify(ctx.params)
				);


		},
	},


	/**
	 * Access action.
	 *
	 */
	access: {
		version: VERSION,
		params: {
			token: 'string',
			path: 'string',
		},
		handler: async (ctx: Context<{ token: string; path: string }>): Promise<any> => {
			if (ctx.service.debug())
				ctx.service.logger.info(
					'auth.access() ctx.params:',
					JSON.stringify(ctx.params)
				);

			//const user = await ctx.call(`${ctx.service.version}.auth.token`, { token: ctx.params.token, action: 'verify', type: 'Access' });
		  //if (!user) throw new Errors.MoleculerError('Invalid token!', 401, 'ERR_INVALIDTOKEN');

			//const targets = await ctx.call(`${ctx.service.version}.user.targets`, { user, path: ctx.params.path });
		  //if (ctx.service.debug()) ctx.service.logger.info('auth.access() targets.length:', targets?.length);
			//if (!targets || targets.length<1) throw new Errors.MoleculerError('Access denied!', 403, 'ERR_NOACCESS');

			//await ctx.service.redis.set(`${user._id}:${user.refreshToken}`, true);
			//ctx.meta.user = user;
		},
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
			password: 'string|min:6',
		},
		handler: async (
			ctx: Context<{ email: string; password: string }>
		): Promise<User> => {
			if (ctx.service.debug())
				ctx.service.logger.info(
					'auth.login() email:',
					JSON.stringify(ctx.params.email)
				);

			if (!validateEmail(ctx.params.email))
				throw new Errors.MoleculerError(
					'Invalid email!',
					401,
					'ERR_WRONGEMAIL'
				);

			const services = await checkService(ctx.service.broker, 'user');
			if (ctx.service.debug())
				ctx.service.logger.info('auth.login() services:', services);
			if (
				services instanceof Error ||
				!services.user ||
				!services.user.available
			) {
				throw new Errors.MoleculerError(
					"Service 'user' is not available!",
					401,
					"ERR_NOSERVICE"
				);
			}

			const userCall = await ctx.call(
				`${ctx.service.version}.user.login`,
				ctx.params
			);
			if (ctx.service.debug())
				ctx.service.logger.info(
					'user.login() userCall:',
					JSON.stringify(userCall)
				);

			const user: User = null;
			if (user) {
			} else {
				throw new Errors.MoleculerError(
					"User not found!",
					403,
					"ERR_NOUSER"
				);
			}

			return user;
		},
	},
};
