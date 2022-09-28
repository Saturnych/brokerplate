/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import routes from '../../routes';
import middlewares from '../../middlewares';

export default {
	upperCase: true,

	ip: process.env.IP || '0.0.0.0',
	port: (process.env.PORT || 3000) as number,

	// HTTPS server with certificate
	https: process.env.HTTPS || {},
	http2: process.env.HTTP2 || false,

	// middlewares
	use: middlewares,

	// Serve assets from 'public' folder
	assets: {
		folder: 'public',
		// Options to `server-static` module
		options: {},
	},

	etag: false,

	// Global CORS settings for all routes
	cors: {
		// Configures the Access-Control-Allow-Origin CORS header.
		origin: '*',
		// Configures the Access-Control-Allow-Methods CORS header.
		methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
		// Configures the Access-Control-Allow-Headers CORS header.
		allowedHeaders: [
			'Origin',
			'X-Requested-With',
			'Content-Type',
			'Accept',
			'Authorization',
			'X-Plate-User',
		],
		// Configures the Access-Control-Expose-Headers CORS header.
		exposedHeaders: [],
		// Configures the Access-Control-Allow-Credentials CORS header.
		credentials: true,
		// Configures the Access-Control-Max-Age CORS header.
		maxAge: 3600,
	},

	rateLimit: {
		// How long to keep record of requests in memory (in milliseconds).
		// Defaults to 60000 (1 min)
		window: 60 * 1000,
		// Max number of requests during window. Defaults to 30
		limit: 100,
		// Set rate limit headers to response. Defaults to false
		headers: true,
		// Function used to generate keys. Defaults to:
		key: (req) => {
			return (
				req.headers["x-forwarded-for"] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress
			);
		},
	},

	// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
	log4XXResponses: false,
	// Logging the request parameters. Set to any log level to enable it. E.g. 'info'
	logRequestParams: null,
	// Logging the response data. Set to any log level to enable it. E.g. 'info'
	logResponseData: null,

	path: '',
	// routes
	routes,
};
