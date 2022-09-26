/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { IncomingMessage, ServerResponse } from 'http';
import { Context } from 'moleculer';
import { ActionReturnData } from '../../types';
import { resObj } from '../../utils';

export default {
	upperCase: true,
	port: (process.env.PORT || 3000) as number,
	path: '',
	// Serve assets from 'public' folder
	assets: {
			folder: 'public',
			// Options to `server-static` module
			options: {},
	},
	use: [
      compression(),
      cookieParser(),
      helmet(),
  ],
	etag: false,
  // Global CORS settings for all routes
  cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: '*',
      // Configures the Access-Control-Allow-Methods CORS header.
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-Grid-Company', 'X-Grid-Warehouse'],
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: true,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600
  },
	rateLimit: {
      // How long to keep record of requests in memory (in milliseconds).
      // Defaults to 60000 (1 min)
      window: 60 * 1000,
      // Max number of requests during window. Defaults to 30
      limit: 30,
      // Set rate limit headers to response. Defaults to false
      headers: true,
      // Function used to generate keys. Defaults to:
      key: (req) => {
          return req.headers["x-forwarded-for"] ||
              req.connection.remoteAddress ||
              req.socket.remoteAddress ||
              req.connection.socket.remoteAddress;
      }
  },
	routes: [
		{
			path: '/api',
			whitelist: [
				// Access to any actions in all services under '/api' URL
				'**',
			],
			// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
			use: [],
			// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
			mergeParams: true,
			// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
			authentication: false,
			// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
			authorization: false,
			// The auto-alias feature allows you to declare your route alias directly in your services.
			// The gateway will dynamically build the full routes from service schema.
			autoAliases: true,
			aliases: {},

			/**
			 * Before call hook. You can check the request.
			 * @param {Context} ctx
			 * @param {Object} route
			 * @param {IncomingMessage} req
			 * @param {ServerResponse} res
			 * @param {Object} data
			 **/
			onBeforeCall: async (
				ctx: Context<any, { userAgent: string }>,
				route: Record<string, any>,
				req: IncomingMessage,
				res: ServerResponse
			): Promise<void> => {
				if (ctx.service.debug())
					ctx.service.logger.info(
						'api.onBeforeCall() meta:',
						ctx.meta
					);
				// Set request headers to context meta
				ctx.meta = {
					userAgent: req.headers['user-agent'],
					...ctx.meta,
				};
			},

			/**
			 * After call hook. You can modify the data.
			 * @param {Context} ctx
			 * @param {Object} route
			 * @param {IncomingMessage} req
			 * @param {ServerResponse} res
			 * @param {Object} data
			 **/
			onAfterCall: async (
				ctx: Context,
				route: Record<string, any>,
				req: IncomingMessage,
				res: ServerResponse,
				data: any
			): Promise<ActionReturnData<any> | any> => {
				if (ctx.service.debug())
					ctx.service.logger.info(
						'api.onAfterCall() meta:',
						ctx.meta,
						'data.length:',
						Object.keys(data).length
					);
				const ret: ActionReturnData<any> = resObj<any>({ data });
				return !!data.metadata ||
					(Array.isArray(data) &&
						(!!data[0].instanceID ||
							data[0].name?.indexOf('$node') > -1))
					? data
					: ret;
			},

			// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
			callingOptions: {},

			bodyParsers: {
				json: {
					strict: false,
					limit: '3MB',
				},
				urlencoded: {
					extended: true,
					limit: '3MB',
				},
			},

			// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
			mappingPolicy: 'all', // Available values: 'all', 'restrict'

			// Enable/disable logging
			logging: true,
		},
	],
	// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
	log4XXResponses: false,
	// Logging the request parameters. Set to any log level to enable it. E.g. 'info'
	logRequestParams: null,
	// Logging the response data. Set to any log level to enable it. E.g. 'info'
	logResponseData: null,

};
