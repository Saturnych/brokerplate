/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Errors, Context } from 'moleculer';
import { VERSION, TELEGRAM_TOKEN, TELEGRAM_CHANNEL } from '../../config/vars';

const botId: string = TELEGRAM_TOKEN?.indexOf(':')>0 ? TELEGRAM_TOKEN.split(':')[0] : '';

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
					'bots.ping() service.settings:',
					service.settings.telegraf, service.telegraf
				);
			return service.settings.telegraf
				? Promise.resolve('pong')
				: Promise.reject('');
		},
	},

	/**
	 * Send action.
	 *
	 */
	send: {
		version: VERSION,
		params: {
			message: 'string',
			chat: 'string|optional',
		},
		handler: async (
			ctx: Context<{ message: string; chat?: string; }>
		): Promise<Record<string, any> | void> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('bots.send() ctx.params:', params);

			if (!!botId) {
				if (!params.chat) params.chat = TELEGRAM_CHANNEL;
				const sent = await service.telegraf.bots[botId].telegram.sendMessage(params.chat, params.message);
				if (service.debug()) service.logger.info('bots.send() sent:', sent);
				return sent;
			}
		},
	},

	test: {
		version: VERSION,
		params: {
			message: 'string|optional',
		},
		handler: async (
			ctx: Context<{ message?: string; }>
		): Promise<void> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('bot.test() ctx.params:', params);
		},
	},
};
