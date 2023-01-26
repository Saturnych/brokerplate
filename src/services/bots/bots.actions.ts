/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Errors, Context } from 'moleculer';
import { VERSION, TELEGRAM_TOKEN } from '../../config/vars';

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
					service.settings.telegraf
				);
			return service.settings.telegraf && service.telegraf
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
			bot: 'string|optional',
			chat: 'string|optional',
		},
		handler: async (
			ctx: Context<{ message: string; bot?: string; chat?: string; }>
		): Promise<Record<string, any> | void> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('bots.send() ctx.params:', params);

			const botId: string = params.bot || (TELEGRAM_TOKEN?.indexOf(':')>0 ? TELEGRAM_TOKEN.split(':')[0] : '');
			if (!!botId) {
				const sent = await service.telegraf.bots[botId].sendAdmin(params.message);
				if (service.debug()) service.logger.info('bots.send() sent:', sent);
				return sent;
				/*
					{ message_id: 1234, from: { id: 123456789, is_bot: true, first_name: 'Bot', username: 'Bot' }, chat: { id: 987654321, first_name: 'User', username: 'User', type: 'private' }, date: 1674744103, text: 'message from api.test()' }
				*/
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
