/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { TelegramService as TelegramMixin } from '@d0whc3r/moleculer-telegram';
import { ServiceBroker } from 'moleculer';
import BasicService from '../BasicService';

import actions from './telegram.actions';

import { TELEGRAM_TOKEN, TELEGRAM_CHANNEL } from '../../config/vars';

const mixins = [TelegramMixin];

const settings = {
	telegramToken: TELEGRAM_TOKEN,
	telegramChannel: TELEGRAM_CHANNEL,
	telegramExtraInfo: {
		parse_mode: 'Markdown',
		disable_web_page_preview: true,
	},
};

export default class TelegramService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'telegram'
	) {
		super(broker, {
			name,
			mixins,
			settings,
			actions,
		});
	}
}
