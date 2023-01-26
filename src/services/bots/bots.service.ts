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

const keyboards = {
	'url-delete': Markup.inlineKeyboard([
		Markup.button.url('❤️', 'http://telegraf.js.org'),
		Markup.button.callback('Delete', 'delete'), // action
	]),
	'first-second': Markup.inlineKeyboard([
		Markup.button.callback('First option', 'first'),
		Markup.button.callback('Second option', 'second'),
	]),
};

botOpts.handlers = {
	start: ctx => ctx.reply('MENU:', keyboards['first-second']), // ctx.startPayload => GOT ERROR!
	help: ctx => {
	  ctx.reply('Send /start to receive a message with a keyboard');
		ctx.reply('Send /oldschool to receive a greeting');
	  ctx.reply('Send /hipster to receive a sign');
	  ctx.reply('Send /quit to stringify');
	},
	command: { // {"update_id":123456789,"message":{"message_id":8740,"from":{"id":987654321,"is_bot":false,"first_name":"User","username":"User","language_code":"ru"},"chat":{"id":987654321,"first_name":"User","username":"User","type":"private"},"date":1674749319,"text":"/hipster","entities":[{"offset":0,"length":8,"type":"bot_command"}]}}
		oldschool: ctx => ctx.reply('Hello'),
		hipster: Telegraf.reply('λ'),
		quit: ctx => ctx.reply(JSON.stringify(ctx.message)),
	},
	action: {
		delete: ctx => ctx.deleteMessage(),
		first: ctx => ctx.reply('first action'),
		second: ctx => ctx.reply('second action'),
	},
	on: {
		sticker: ctx => ctx.reply('👍'),
		message: ctx => {
			if (Number(ctx.message.chat.id)>0)
			ctx.copyMessage(ctx.message.chat.id, keyboards['url-delete']);
			else
			ctx.reply('FUCK OFF!');
		},
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
