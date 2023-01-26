/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @class TelegrafBot
 *
 */

import { session, Context, Telegraf, Telegram } from 'telegraf';

interface BotSession {
	messageCount?: number;
};

interface BotContext extends Context {
	session?: BotSession;
};

const initBot = (bot, handlers): void => {
	for (let route of Object.keys(handlers)) {
		if (['start','help'].includes(route)) {
			bot[route](handlers[route]);
		} else {
			for (let type of Object.keys(handlers[route])) {
				bot[route](type, handlers[route][type]);
			}
		}
	}
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
			this._ctx = ctx;
			if (opts.debug) console.time(`Processing update ${ctx.update.update_id}`);
			if (opts.debug) console.info(ctx.update);
			await next(); // runs next middleware
			// runs after next middleware finishes
			if (opts.debug) console.timeEnd(`Processing update ${ctx.update.update_id}`);
		});

		this.bot.catch((err) => {
			console.error(err?.response, err?.on);
		});
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

		initBot(this.bot, opts.handlers);
		this.bot.telegram.sendMessage(opts.admin, `bot #${opts.id} initialized`);

		this.bot.launch();
	}

	public stop(msg = 'BOTSTOPPED') {
		this.bot.stop(msg);
	}

	public get id(): string {
		return this._id;
	}

	public get ctx(): BotContext {
		return this._ctx;
	}

	public get telegram(): Telegram {
		return this.bot.telegram;
	}

}
