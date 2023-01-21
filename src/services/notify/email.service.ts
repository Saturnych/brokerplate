/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import BasicService from '../BasicService';

import nodemailer from '../../mixins/nodemailer.mixin';
import actions from './email.actions';

import {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASS,
	SMTP_FROM_EMAIL,
	SMTP_BCC_EMAIL,
	RESOLVE_SERVERS
} from '../../config/vars';

const options = {
	host: SMTP_HOST,
	port: SMTP_PORT, // 465 or 587
	secure: (SMTP_PORT===465)?true:false, // true for 465, false for other ports
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
	from: SMTP_FROM_EMAIL,
	bcc: SMTP_BCC_EMAIL,
	resolve: !!RESOLVE_SERVERS ? (Array.isArray(RESOLVE_SERVERS)?RESOLVE_SERVERS:parseJson(RESOLVE_SERVERS, [])):[],
};

const mixins = [ nodemailer({ options }) ];

export default class EmailService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'email'
	) {
		super(broker, {
			name,
			mixins,
			actions,
			settings: options,
		});
	}
};
