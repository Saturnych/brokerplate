/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Telegraf, Markup } from 'telegraf';
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

const keyboard = Markup.inlineKeyboard([
	Markup.button.url('❤️', 'http://telegraf.js.org'),
	Markup.button.callback('Delete', 'delete'), // action
]);

botOpts.handlers = {
	start: ctx => ctx.reply(ctx.startPayload), // GOT ERROR!
	help: ctx => ctx.reply('Send me a sticker'),
	command: {
		oldschool: ctx => ctx.reply('Hello'),
		hipster: Telegraf.reply('λ'),
		quit: ctx => ctx.reply(JSON.stringify(ctx.message)),
	},
	action: {
		delete: ctx => ctx.deleteMessage(),
	},
	on: {
		sticker: ctx => ctx.reply('👍'),
		message: ctx => ctx.copyMessage(ctx.message.chat.id, keyboard),
		text: async (ctx) => {
			ctx.session ??= { messageCount: 0 };
			ctx.session.messageCount++;
			await ctx.reply(`Seen ${ctx.session.messageCount} messages.`);
		},
	},
};

const options = {
	[botOpts.id]: botOpts, // config for just one bot
};

const mixins = [telegraf({ options })];

export default class BotService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'bots'
	) {
		super(broker, {
			name,
			mixins,
			actions,
		});
	}
};
