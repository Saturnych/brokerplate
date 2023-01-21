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
//import emailTemplates from '../../config/email/templates';
const emailTemplates = {};

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
					'email.ping() service.settings.host:',
					service.settings.host, service.nodemailer,
				);
			return service.settings.host ? Promise.resolve('pong') : Promise.reject('');
		},
	},

	/**
	 * Send action.
	 *
	 */
	send: {
		version: VERSION,
		params: {
			to: 'string',
			subject: 'string',
			email: 'object',
			from: 'string|optional',
			bcc: 'string|optional',
		},
		handler: async (
			ctx: Context<{ to: string; subject: string; email: Record<string,any>; from?: string; bcc?: string; }>
		): Promise<Record<string,any>> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info(
					'email.send() ctx.params:',
					params,
				);
				
			const { to, subject, email, from, bcc } = params;
			const { html, text } = (emailTemplates && !!email.templateName && !!email.data) ? emailTemplates[email.templateName](email.data) : email;
			const message = {
				to,
				subject,
				html,
				text,
				from: from || service.settings.from,
				bcc: bcc || service.settings.bcc,
			};

			const sent = await service.nodemailer.sendMail(message);
			if (service.debug())
				service.logger.info(
					'email.send() sent:',
					sent,
				);
			return sent;
		},
	},

};
