/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { session, Context, Telegraf, Markup } from 'telegraf';
import { ServiceBroker } from 'moleculer';
import BasicService from '../BasicService';

import telegraf from '../../mixins/telegraf.mixin';
import actions from './bot.actions';

import { DEBUG, TELEGRAM_TOKEN, TELEGRAM_CHANNEL } from '../../config/vars';

const options = {
	debug: DEBUG,
	botToken: TELEGRAM_TOKEN,
	botAdmin: TELEGRAM_CHANNEL,
};

const mixins = [telegraf({ options })];

const keyboard = Markup.inlineKeyboard([
	Markup.button.url("❤️", "http://telegraf.js.org"),
	Markup.button.callback("Delete", "delete"),
]);

const initBot = (bot, pingId?: string, pingMessage?: string): void => {
	bot.start((ctx) => ctx.reply(ctx.startPayload)); // ERROR!
	bot.help((ctx) => ctx.reply('Send me a sticker'));
	bot.command('oldschool', (ctx) => ctx.reply('Hello'));
	bot.command('hipster', Telegraf.reply('λ'));
	bot.on('sticker', (ctx) => ctx.reply('👍'));
	bot.hears('hi', (ctx) => ctx.reply('Hey there'));
	//bot.on('message', ctx => ctx.copyMessage(ctx.message.chat.id, keyboard));
	//bot.action('delete', ctx => ctx.deleteMessage());
	bot.command('quit', async (ctx) => {
		await ctx.reply(JSON.stringify(ctx.message));
	});
	bot.on('text', async (ctx) => {
		ctx.session ??= { messageCount: 0 };
		ctx.session.messageCount++;
		await ctx.reply(`Seen ${ctx.session.messageCount} messages.`);
	});
	bot.launch();
	if (!!pingId && !!pingMessage) bot.telegram.sendMessage(pingId, pingMessage);
};

export default class BotService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'bot'
	) {
		super(broker, {
			name,
			mixins,
			actions,
			settings: options,
			started: () => {
				initBot(this.telegraf, options.botAdmin, 'bot started');
			},
		});
	}

	public botStop(msg = 'BOTSTOPPED') {
		this.telegraf.stop(msg);
	}

	public botInit() {
		initBot(this.telegraf, options.botAdmin, 'botInit()');
	}
}
