/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Errors, Context } from 'moleculer';
import { User, ActionReturnData, returnData } from '../../types';
import { checkService, validateEmail } from '../../utils';
import { VERSION } from '../../config/vars';

export type AuthLoginData = ActionReturnData<User>;

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
		): Promise<AuthLoginData> => {
			if (ctx.service.debug())
				ctx.service.logger.info(
					'auth.login() ctx.params:',
					JSON.stringify(ctx.params)
				);

			if (!validateEmail(ctx.params.email)) {
				returnData.error = new Errors.MoleculerError(
					'Invalid email!',
					401,
					'ERR_WRONGEMAIL'
				);
				return Promise.reject(returnData);
			}

			const services = await checkService(ctx.service.broker, 'user');
			if (ctx.service.debug())
				ctx.service.logger.info('auth.login() services:', services);
			if (
				services instanceof Error ||
				!services.user ||
				!services.user.available
			) {
				returnData.error = new Errors.MoleculerError(
					"Service 'user' is not available!",
					401,
					"ERR_NOSERVICE"
				);
				return Promise.reject(returnData);
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
				//returnData.data = user as User;
			} else {
				returnData.error = new Errors.MoleculerError(
					"User not found!",
					403,
					"ERR_NOUSER"
				);
			}

			return returnData.error
				? Promise.reject(returnData)
				: Promise.resolve(returnData);
		},
	},
};
