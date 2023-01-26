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

import telegraf from '../../mixins/telegraf.mixin';
import actions from './bots.actions';

import { DEBUG, TELEGRAM_TOKEN, TELEGRAM_CHANNEL } from '../../config/vars';

const botOpts = {
	debug: DEBUG,
	id: TELEGRAM_TOKEN?.indexOf(':')>0 ? TELEGRAM_TOKEN.split(':')[0] : '0',
	token: TELEGRAM_TOKEN || '',
	admin: TELEGRAM_CHANNEL || '',
	handlers: {},
};

const options = {
	[botOpts.id]: botOpts, // config for just one bot
};

const mixins = [telegraf({ options })];

export default class BotService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'bot'
	) {
		super(broker, {
			name,
			mixins,
			actions,
		});
	}
};
