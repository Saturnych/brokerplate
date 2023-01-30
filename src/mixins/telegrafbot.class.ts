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

interface BotError {
	ts: number;
	ok?: boolean;
	error_code?: number;
	description?: string;
	method?: string;
	payload?: Record<string, any>;
}

interface BotSession {
	messageCount?: number;
	errors?: BotError[];
}

interface BotContext extends Context {
	session?: BotSession;
}

const initSession = {
	messageCount: 0,
	errors: [],
};

export default class TelegrafBot {
	private _id: string;
	private _token: string;
	private _admin: string;
	private _ctx: BotContext;
	public bot;

	public constructor(public opts: Record<string, any>) {
		this._id = String(opts.id);
		this._token = String(opts.token);
		this._admin = String(opts.admin);
		this.bot = new Telegraf<BotContext>(opts.token);

		this.bot.use(session()); // Make session data available
		this.bot.use(async (ctx, next) => {
			ctx.session ??= { messageCount: 0, errors: [] };
			const strTime = `Bot #${ctx.botInfo?.id || opts.id} processing update ${ctx.update.update_id}`;
			if (opts.debug)	console.time(strTime);
			if (opts.debug) console.info(JSON.stringify(ctx.update));
			try {
				await next(); // runs next middleware
			} catch (err) {
				if (opts.debug) console.error('middleware catch err:', err);
				const error: BotError = {
					ts: Date.now(),
					ok: err.response?.ok || false,
	      	error_code: err.response?.error_code || 400,
	      	description: err.response?.description || '',
					method: err.on?.method || '',
					payload: err.on?.payload || {}, // { chat_id: 144366461, message_thread_id: undefined, text: '' }
				};
				ctx.session.errors.push(error);
			}
			this._ctx = ctx;
			// runs after next middleware finishes
			if (opts.debug)	console.timeEnd(strTime);
		});

		this.bot.catch((err) => {
			console.error('bot catch err:', err);
		});
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

		this.init(this.bot, opts.handlers);
		const sent = this.sendAdmin(`Bot #${opts.id} initialized`);

		this.bot.launch();
	}

	private init(bot, handlers): void {
		for (const route of Object.keys(handlers)) {
			if (['start', 'help'].includes(route)) {
				bot[route](handlers[route]);
			} else {
				for (const type of Object.keys(handlers[route])) {
					bot[route](type, handlers[route][type]);
				}
			}
		}
	}

	public sendAdmin(msg): Record<string, any> {
		return this.bot.telegram.sendMessage(this._admin, msg);
	}

	public stop(msg = 'BOTSTOPPED'): void {
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
