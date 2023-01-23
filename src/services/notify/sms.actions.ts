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

const SUCCESS_STATUS = 'approved';

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
					'sms.ping() service.twilio.accountSid:',
					service.twilio.accountSid
				);
			return service.twilio.accountSid
				? Promise.resolve("pong")
				: Promise.reject("");
		},
	},

	/**
	 * SendSMSCode action.
	 *
	 */
	sendSMSCode: {
		version: VERSION,
		params: {
			to: 'string',
			channel: 'string|optional',
		},
		handler: async (
			ctx: Context<{ to: string; channel?: string }>
		): Promise<Record<string, any>> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('sms.sendSMSCode() ctx.params:', params);

			const { verify } = service.twilio;
			const { sid } = await verify.services.create({
				friendlyName: service.settings.serviceName,
			});
			if (!params.channel)
				params.channel = service.settings.serviceChannel;

			const sendVerifyCode = await verify
				.services(sid)
				.verifications.create(params)
				.catch((err) => console.error(err));
			if (service.debug())
				service.logger.info(
					'sms.sendSMSCode() sendVerifyCode:',
					sendVerifyCode
				);
			return sendVerifyCode;
		},
	},

	/**
	 * VerifySMSCode action.
	 *
	 */
	verifySMSCode: {
		version: VERSION,
		params: {
			to: 'string',
			code: 'string',
			sid: 'string',
		},
		handler: async (
			ctx: Context<{ to: string; code: string; sid: string }>
		): Promise<boolean> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('sms.verifySMSCode() ctx.params:', params);

			const { verify } = service.twilio;
			const { sid, ...pars } = params;

			const verificationCheck = await verify
				.services(sid)
				.verificationChecks.create(pars)
				.catch((err) => console.error(err));
			return verificationCheck?.status === SUCCESS_STATUS;
		},
	},
};
