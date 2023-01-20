/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context } from 'moleculer';
import { getPerfhookInfo } from '../../utils';
import { VERSION } from '../../config/vars';

export type ApiHealthData = {
	name: string;
	state: string;
	timestamp: number;
	uptime?: number;
	perfhook?: Record<string, any>;
};

export type ApiTestData = {
	authPing: string | unknown;
	redisKeysCount?: number;
	tgPing?: any;
	tgSend?: any;
};

export default {
	/**
	 * Health action.
	 *
	 */
	health: {
		version: VERSION,
		rest: {
			method: 'GET',
			path: '/health',
		},
		params: {},
		handler: async (ctx: Context): Promise<ApiHealthData> => {
			if (ctx.service.debug()) ctx.service.logger.info('api.health()');
			return {
				name: ctx.service.name,
				state: ctx.service.state(),
				timestamp: Date.now(),
				uptime: process && process.uptime(),
				perfhook: getPerfhookInfo(ctx.service.perfhook()),
			};
		},
	},

	/**
	 * Test action.
	 *
	 */
	test: {
		version: VERSION,
		rest: {
			method: 'GET',
			path: '/test',
		},
		params: {},
		handler: async (ctx: Context): Promise<ApiTestData> => {
			if (ctx.service.debug()) ctx.service.logger.info('api.test()');
			const tgSend: any = await ctx.call(
				`${ctx.service.version}.telegram.send`, { message: 'message from api.test()' }
			);
			const tgPing: string | undefined = await ctx.call(
				`${ctx.service.version}.telegram.ping`
			);
			const authPing: string | undefined = await ctx.call(
				`${ctx.service.version}.auth.ping`
			);
			const redisKeys: Array<any> | undefined = await ctx.call(
				`${ctx.service.version}.auth.keys`
			);
			const redisKeysCount: number = redisKeys?.length || 0;
			//const userPing = await ctx.call(`${ctx.service.version}.user.ping`);
			//const userCount = await ctx.call(`${ctx.service.version}.user.count`);
			return {
				tgPing,
				tgSend,
				authPing,
				redisKeysCount,
			};
		},
	},
};
