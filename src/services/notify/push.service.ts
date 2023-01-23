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
import { parseJson } from '../../utils';

import fcm from '../../mixins/fcm.mixin';
import actions from './push.actions';

import {
	FCM_DEBUG,
	FCM_PROJECT_ID,
	FCM_SENDER_ID,
	FCM_TOPIC,
	FCM_SERVICE_ACCOUNT,
} from '../../config/vars';

const options = {
	debug: FCM_DEBUG,
	projectId: FCM_PROJECT_ID,
	senderId: FCM_SENDER_ID,
	topic: FCM_TOPIC,
	serviceAccount: parseJson(FCM_SERVICE_ACCOUNT),
};

const mixins = [];
if (!!options.projectId) mixins.push(fcm({ options }));

export default class PushService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'push'
	) {
		super(broker, {
			name,
			mixins,
			actions,
		});
	}
};
