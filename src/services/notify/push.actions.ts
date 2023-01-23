/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Errors, Context } from 'moleculer';
import { VERSION } from '../../config/vars';

const messageSend = async (fcm, payload, func): Promise<any> =>
	new Promise((resolve, reject) => {
		if (!fcm) reject();
		fcm[func](payload)
			.then((resp) => resolve(resp))
			.catch((err) => reject(err));
	});

const topicSubscribe = async (fcm, tokens, topic, func): Promise<any> =>
	new Promise((resolve, reject) => {
		if (!fcm || !Array.isArray(tokens) || tokens.length < 1) reject(); //
		fcm[func](tokens, topic)
			.then((resp) => resolve(resp))
			.catch((err) => reject(err));
	});

export default {
	/**
	 * Ping action.
	 *
	 */
	ping: {
		version: VERSION,
		params: {},
		handler: async (ctx: Context): Promise<string> => {
			const { service } = ctx;
			if (service.debug())
				service.logger.info(
					'push.ping() service.settings:',
					service.settings
				);
			return service.settings.projectId
				? Promise.resolve('pong')
				: Promise.reject('');
		},
	},

	/**
	 * Subscribe action.
	 *
	 */
	subscribe: {
		version: VERSION,
		params: {
			tokens: 'array',
			action: 'string|optional',
			topic: 'string|optional',
		},
		handler: async (
			ctx: Context<{ tokens: string[]; action?: string; topic?: string }>
		): Promise<Record<string, any>> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('push.subscribe() params:', params);

			if (!params.topic) params.topic = service.settings.topic;
			const func = params.action
				? params.action === 'unsubscribe'
					? 'unsubscribeFromTopic'
					: 'subscribeToTopic'
				: 'subscribeToTopic';
			const sent = await topicSubscribe(
				service.fcm,
				params.tokens,
				params.topic,
				func
			);
			if (service.debug())
				service.logger.info('push.subscribe() sent:', sent);
			return sent;
		},
	},

	/**
	 * Send action.
	 *
	 */
	send: {
		version: VERSION,
		params: {
			payload: 'object',
		},
		handler: async (
			ctx: Context<{ payload: Record<string, any> }>
		): Promise<Record<string, any>> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('push.send() params:', params);

			const func =
				!!params.payload.token && !Array.isArray(params.payload.token)
					? 'send'
					: 'sendMulticast';
			const sent = await messageSend(service.fcm, params.payload, func);
			if (service.debug()) service.logger.info('push.send() sent:', sent);
			return sent;
		},
	},
};
