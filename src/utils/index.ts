/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { validate as uuidValidate } from 'uuid';
import { Service, ServiceBroker } from 'moleculer';

const units = ['h', 'm', 's', 'ms', 'μs', 'ns'];
const divisors = [60 * 60 * 1000, 60 * 1000, 1000, 1, 1e-3, 1e-6];

export const isFunction = (fn): boolean => typeof fn === 'function';

export const isString = (s): boolean =>
	typeof s === 'string' || s instanceof String;

export const isObject = (o): boolean =>
	o !== null && typeof o === 'object' && !(o instanceof String);

export const isPlainObject = (o): boolean =>
	o != null
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
	if (milli == null) return '?';
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
	broker: ServiceBroker,
	serviceName = ''
): Promise<Record<string, Service | Service[] | unknown> | Error> => {
	try {
		const obj: Record<string, Service | Service[]> = {};
		obj.services = await broker.call('$node.services');
		if (serviceName) {
			const service = obj.services.filter((s) => s.name == serviceName);
			obj[serviceName] = service.length > 0 && (service[0] as Service);
		}
		return Promise.resolve(obj);
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
