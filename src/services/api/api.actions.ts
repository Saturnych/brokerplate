/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context } from 'moleculer';

import { VERSION } from '../../config/vars';

import { getPerfhookInfo } from '../../utils';

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
			if (ctx.service.debug())
				ctx.service.logger.info('api.health()');
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
			if (ctx.service.debug())
				ctx.service.logger.info('api.test()');
	    const authPing: string = `${(await ctx.call(`${ctx.service.version}.auth.ping`))}`;
			const redisKeys: Array<any> = [].concat(await ctx.call(`${ctx.service.version}.auth.keys`));
	    const redisKeysCount: number = redisKeys.length;
	    //const userPing = await ctx.call(`${ctx.service.version}.user.ping`);
	    //const userCount = await ctx.call(`${ctx.service.version}.user.count`);
	    return {
				authPing,
				redisKeysCount,
			};
		},
	},

};
