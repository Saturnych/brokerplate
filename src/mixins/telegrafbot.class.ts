/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin BotMixin
 *
 */

import { session, Context, Telegraf, Markup } from 'telegraf';

interface BotSession {
	messageCount?: number;
};

interface BotContext extends Context {
	session?: BotSession;
};

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
	if (!!pingId && !!pingMessage) bot.telegram.sendMessage(pingId, pingMessage);
};

export default class TelegrafBot {
	private _id: string;
	private _token: string;
	private _admin: string;
	private _ctx: BotContext;
	public bot;

	public constructor(public opts: Record<string, any>) {
		this._id = String(opts.id);
		this._token = opts.token;
		this._admin = opts.admin;
		this.bot = new Telegraf<BotContext>(opts.token);

		// Make session data available
		this.bot.use(session());
		this.bot.use(async (ctx, next) => {
			this.ctx = ctx;
			if (opts.debug) console.time(`Processing update ${ctx.update.update_id}`);
			if (opts.debug) console.info(ctx.update);
			await next(); // runs next middleware
			// runs after next middleware finishes
			if (opts.debug) console.timeEnd(`Processing update ${ctx.update.update_id}`);
		});

		this.bot.catch((err) => {
			console.error(err); // err.response, err.on
		});
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

		initBot(this.bot, opts.admin, `bot #${opts.id} initialized`);

		this.bot.launch();
	}

	public stop(msg = 'BOTSTOPPED') {
		this.bot.stop(msg);
	}

	public get id(): string {
		return this._id;
	}

	private set id(id: string) {
		this._id = id;
	}

	public get ctx(): BotContext {
		return this._ctx;
	}

	private set ctx(context: BotContext) {
		this._ctx = context;
	}

	public get telegram() {
		return this.bot.telegram;
	}

}
