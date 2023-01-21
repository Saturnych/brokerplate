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
					'telegram.ping() service.settings.telegramExtraInfo:',
					service.settings.telegramExtraInfo,
				);
			return service.settings.telegramExtraInfo ? Promise.resolve('pong') : Promise.reject('');
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
			channel: 'string|optional',
			token: 'string|optional',
		},
		handler: async (
			ctx: Context<{ message: string; channel?: string; token?: string; }>
		): Promise<Record<string,any>> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info(
					'telegram.send() ctx.params:',
					params,
				);
				
			if (!!!params.channel) params.channel = service.settings.telegramChannel;
			const sent = await service.actions.sendMessage(params);
			if (service.debug())
				service.logger.info(
					'telegram.send() sent:',
					sent,
				);
			return sent;
		},
	},

};
