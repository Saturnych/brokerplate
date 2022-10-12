/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { IncomingMessage, ServerResponse } from 'http';
import { Service, ServiceBroker, LoggerInstance } from 'moleculer';
import { validate as uuidValidate } from 'uuid';
import { onBeforeCall, onAfterCall } from '../hooks';
import { ActionReturnData, returnData } from '../types';

const units = ['h', 'm', 's', 'ms', 'μs', 'ns'];
const divisors = [60 * 60 * 1000, 60 * 1000, 1000, 1, 1e-3, 1e-6];

export const isFunction = (fn): boolean => typeof fn === 'function';

export const isString = (s): boolean =>
	typeof s === 'string' || s instanceof String;

export const isObject = (o): boolean =>
	o !== null && typeof o === 'object' && !(o instanceof String);

export const isPlainObject = (o): boolean =>
	o !== null
		? Object.getPrototypeOf(o) === Object.prototype ||
		  Object.getPrototypeOf(o) === null
		: false;

export const isDate = (d): boolean =>
	d instanceof Date && !Number.isNaN(d.getTime());

export const flatten = (arr) =>
	Array.prototype.reduce.call(arr, (a, b) => a.concat(b), []);

export const removeFromArray = (arr: Array<any>, item): Array<any> => {
	if (arr.length < 1 || arr.indexOf(item) < 0) return arr;
	return arr.splice(arr.indexOf(item), 1);
};

export const humanize = (milli): string => {
	if (milli === null) return '?';
	for (let i = 0; i < divisors.length; i++) {
		const val = milli / divisors[i];
		if (val >= 1.0) return String(Math.floor(val) + units[i]);
	}
	return 'now';
};

export const getPerfhookInfo = (perfhook) => ({
	min: humanize(perfhook.min / 1e6),
	max: humanize(perfhook.max / 1e6),
	mean: humanize(perfhook.mean / 1e6),
	stddev: humanize(perfhook.stddev / 1e6),
	p10: humanize(perfhook.percentile(10) / 1e6),
	p50: humanize(perfhook.percentile(50) / 1e6),
	p99: humanize(perfhook.percentile(99) / 1e6),
});

export const getServices = async (
	broker: ServiceBroker
): Promise<Service[] | any[]> => {
	try {
		const services: Service[] = await broker.call('$node.services');
		return Promise.resolve(services);
	} catch (e) {
		return Promise.reject([]);
	}
};

export const checkService = async (
	broker: ServiceBroker,
	serviceName: string
): Promise<Service | Error> => {
	try {
		const services = (await getServices(broker)).filter(
			(s) => s.name === serviceName && s.available
		);
		if (services.length > 0) Promise.resolve(services[0]);
		else throw new Error(`Service '${serviceName}' is not available!`);
	} catch (e) {
		return Promise.reject(e);
	}
};

/**
 * JSON.parse() catching errors
 *
 * @param {String} data
 * @param {Object} json
 *
 */
export const parseJson = (data: string, json = {}) => {
	try {
		json = JSON.parse(data);
	} catch (err) {
		console.error(err);
	}
	return json;
};

export const validateEmail = (email: string) =>
	String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);

export const validatePassword = (password: string) =>
	String(password).match(
		/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
	);

export const getRandomString = (): string =>
	Math.random().toString(36).slice(-8);

export const getRandomInt = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isNumeric = (n): boolean => !isNaN(parseFloat(n)) && isFinite(n);

export const isValidId = (id: string): boolean => uuidValidate(id);

/**
 * Use to simplify the http returns
 *
 * @function
 * @param {Number} status HTTP Status code
 * @param {Boolean} success Success or not
 * @param {String} message Optional message
 * @param {Object} data Data to be returned
 *
 */
export const resObj = <T>(retVal): ActionReturnData<T> =>
	Object.assign({}, returnData, retVal);

/**
 * Global error handler
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {Object} err
 * @param {Object} logger
 * @param {Boolean} debug
 * @param {Boolean} stringify
 * @param {String} contentType
 * @param {Number} defaultErrorCode
 *
 */
export const resError = (
	req: IncomingMessage,
	res: ServerResponse,
	error: Error | any,
	logger: LoggerInstance | Console = console,
	debug = false,
	contentType = 'application/json; charset=utf-8', // text/plain
	defaultErrorCode = 501
): void => {
	if (debug) logger.error('service.onError():', error);
	const statusCode = Number(error.code || defaultErrorCode);
	const ret: ActionReturnData<null> = resObj<null>({
		statusCode,
		success: false,
		message: `${error.message}`,
		error: error.errno,
	});
	const result: string = JSON.stringify(ret);
	res.statusCode = statusCode;
	res.setHeader('Content-Type', contentType);
	res.end(result);
};

export const configRoute = (route) => {
	const def = {
		path: '',
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
		// hooks
		onBeforeCall,
		onAfterCall,
	};

	for (const key in def) {
		route[key] = key in route ? route[key] : def[key];
	}

	return route;
};
