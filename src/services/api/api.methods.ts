/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { IncomingMessage } from 'http';
import { Context } from 'moleculer';
import ApiGateway from 'moleculer-web';

export default {
	/**
	 * Authenticate the request. It checks the `Authorization` token value in the request header.
	 * Check the token value & resolve the user by the token.
	 * The resolved user will be available in `ctx.meta.user`
	 *
	 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
	 *
	 * @param {Context} ctx
	 * @param {any} route
	 * @param {IncomingMessage} req
	 * @returns {Promise}
	 **/
	authenticate: async (
		ctx: Context,
		route: any,
		req: IncomingMessage
	): Promise<any> => {
		// Read the token from header
		const auth = req.headers.authorization;

		if (auth && auth.startsWith('Bearer')) {
			const token = auth.slice(7);

			// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
			if (token === '123456') {
				// Returns the resolved user. It will be set to the `ctx.meta.user`
				return {
					id: 1,
					name: 'John Doe',
				};
			} else {
				// Invalid token
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN,
					{
						error: 'Invalid Token',
					}
				);
			}
		} else {
			// No token. Throw an error or do nothing if anonymous access is allowed.
			// Throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
			return null;
		}
	},

	/**
	 * Authorize the request. Check that the authenticated user has right to access the resource.
	 *
	 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
	 *
	 * @param {Context} ctx
	 * @param {Object} route
	 * @param {IncomingMessage} req
	 * @returns {Promise}
	 **/
	authorize: async (
		ctx: Context<any, { user: string }>,
		route: Record<string, undefined>,
		req: IncomingMessage
	): Promise<any> => {
		// Get the authenticated user.
		const user = ctx.meta.user;

		// It check the `auth` property in action schema.
		// @ts-ignore
		if (req.$action.auth === 'required' && !user) {
			throw new ApiGateway.Errors.UnAuthorizedError('NO_RIGHTS', {
				error: 'Unauthorized',
			});
		}
	},
};
