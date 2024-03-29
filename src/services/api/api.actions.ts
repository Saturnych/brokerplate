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
import { VERSION, TWILIO_TEST_PHONE, SMTP_FROM_EMAIL } from '../../config/vars';

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
	tgPing?: string;
	botPing?: string;
	smsPing?: string;
	emailPing?: string;
	pushPing?: string;
	queuePing?: string;
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

			const queuePing: string | undefined = await ctx.call(
				`${ctx.service.version}.queue.ping`
			);
			//const queueCreateJob: any = await ctx.call(`${ctx.service.version}.queue.createJob`, { name: `${VERSION}.email.send`, data: { id: 1, from: SMTP_FROM_EMAIL } });
			//if (ctx.service.debug()) ctx.service.logger.info('queueCreateJob():', queueCreateJob.queue.name);

			const botPing: string | undefined = await ctx.call(
				`${ctx.service.version}.bots.ping`
			);
			const botSend: any = await ctx.call(`${ctx.service.version}.bots.send`, { message: 'message from api.test()' });

			const tgPing: string | undefined = await ctx.call(
				`${ctx.service.version}.telegram.ping`
			);
			//const tgSend: any = await ctx.call(`${ctx.service.version}.telegram.send`, { message: 'message from api.test()' });

			const smsPing: string = '';
			//const smsPing: string | undefined = await ctx.call(`${ctx.service.version}.sms.ping`);
			//const smsSend: any = await ctx.call(`${ctx.service.version}.sms.sendSMSCode`, { to: TWILIO_TEST_PHONE });

			const emailPing: string | undefined = await ctx.call(
				`${ctx.service.version}.email.ping`
			);
			//const emailSend: any = await ctx.call(`${ctx.service.version}.email.send`, { to: SMTP_FROM_EMAIL, subject: 'test', email: { text: '', html: 'hi!' } });

			const authPing: string | undefined = await ctx.call(
				`${ctx.service.version}.auth.ping`
			);
			const redisKeys: Array<any> | undefined = await ctx.call(
				`${ctx.service.version}.auth.keys`
			);
			const redisKeysCount: number = redisKeys?.length || 0;

			//const pushPing: string | undefined = await ctx.call(`${ctx.service.version}.push.ping`);
			//const userPing = await ctx.call(`${ctx.service.version}.user.ping`);
			//const userCount = await ctx.call(`${ctx.service.version}.user.count`);
			return {
				queuePing,
				emailPing,
				smsPing,
				botPing,
				tgPing,
				authPing,
				redisKeysCount,
			};
		},
	},
};
