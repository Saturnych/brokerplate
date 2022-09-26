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
const { Errors } = ApiGateway;

export default {
	/**
	 * Authenticate the request. It checks the `Authorization` token value in the request header.
	 * Check the token value & resolve the user by the token.
	 * The resolved user will be available in `ctx.meta.user`
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
		const auth: string = req.headers?.authorization || '';

		if (!!auth && auth.startsWith('Bearer')) {
			const token: string = auth.slice(7).trim();
			if (!!token) {
		    return ctx.call(`${ctx.service.version}.auth.access`, {
		      token,
		      path: route.opts.path,
		    });
		  } else
		    throw new Errors.UnAuthorizedError(Errors.ERR_INVALID_TOKEN, {	error: 'Invalid Token' });
		} else {
			// No token. Throw an error or do nothing if anonymous access is allowed.
			// throw new Errors.UnAuthorizedError(Errors.ERR_NO_TOKEN);
			return null;
		}
	},

	/**
	 * Authorize the request. Check that the authenticated user has right to access the resource.
	 *
	 * @param {Context} ctx
	 * @param {Object} route
	 * @param {IncomingMessage} req
	 * @returns {Promise}
	 **/
	authorize: async (
		ctx: Context<any, { user: any }>,
		route: Record<string, undefined>,
		req: IncomingMessage
	): Promise<any> => {
		// Get the authenticated user.
		const user = ctx.meta.user;

		// It check the `auth` property in action schema.
		// @ts-ignore
		if (req.$action.auth === 'required' && !user) {
			throw new Errors.UnAuthorizedError(Errors.ERR_UNABLE_DECODE_PARAM, {
				error: 'Unauthorized',
			});
		}
	},
};


/*
InvalidRequestBodyError: typeof InvalidRequestBodyError;
InvalidResponseTypeError: typeof InvalidResponseTypeError;
UnAuthorizedError: typeof UnAuthorizedError;
ForbiddenError: typeof ForbiddenError;
BadRequestError: typeof BadRequestError;
RateLimitExceeded: typeof RateLimitExceeded;
NotFoundError: typeof NotFoundError;
ServiceUnavailableError: typeof ServiceUnavailableError;

ERR_NO_TOKEN: 'NO_TOKEN',
ERR_INVALID_TOKEN: 'INVALID_TOKEN',
ERR_UNABLE_DECODE_PARAM: 'UNABLE_DECODE_PARAM',
ERR_ORIGIN_NOT_FOUND: 'ORIGIN_NOT_FOUND',
*/
