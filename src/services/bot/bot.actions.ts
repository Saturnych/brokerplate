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
					'bot.ping() service.settings.botAdmin:',
					service.settings.botAdmin
				);
			return service.settings.botAdmin
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
		): Promise<Record<string, any>> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('bot.send() ctx.params:', params);

			if (!params.chat) params.chat = service.settings.botAdmin;
			const sent = await service.telegraf.telegram.sendMessage(params.chat, params.message);
			if (service.debug())
				service.logger.info('bot.send() sent:', sent);
			return sent;
		},
	},
};
