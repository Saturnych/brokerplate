import {IncomingMessage, ServerResponse} from 'http';
import {Context} from 'moleculer';

export default {
	port: (process.env.PORT || 3000) as number,

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
					ctx.service.logger.info('api.onBeforeCall():', ctx.meta);
				// Set request headers to context meta
				// ctx.meta.userAgent = req.headers['user-agent'];
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
				data: Record<string, any>
			): Promise<Record<string, any>> => {
				if (ctx.service.debug())
					ctx.service.logger.info('api.onAfterCall():', ctx.meta);
				return data;
			},

			// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
			callingOptions: {},

			bodyParsers: {
				json: {
					strict: false,
					limit: '1MB',
				},
				urlencoded: {
					extended: true,
					limit: '1MB',
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
	// Serve assets from 'public' folder
	assets: {
		folder: 'public',
		// Options to `server-static` module
		options: {},
	},
};
