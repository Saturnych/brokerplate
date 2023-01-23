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

import twilio from '../../mixins/twilio.mixin';
import actions from './sms.actions';

import {
	TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN,
	TWILIO_SERVICE_NAME,
	TWILIO_SERVICE_CHANNEL,
} from '../../config/vars';

const options = {
	accountSid: TWILIO_ACCOUNT_SID,
	authToken: TWILIO_AUTH_TOKEN,
	serviceName: TWILIO_SERVICE_NAME,
	serviceChannel: TWILIO_SERVICE_CHANNEL,
};

const mixins = [];
if (!!options.accountSid && !!options.authToken) mixins.push(twilio({ options }));

export default class SmsService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'sms'
	) {
		super(broker, {
			name,
			mixins,
			actions,
		});
	}
};
