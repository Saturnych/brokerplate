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

import { session, Context, Telegraf } from 'telegraf';

interface BotSession {
	messageCount: number;
	// ... more session data go here
};

// Define your own context type
interface BotContext extends Context {
	session?: BotSession;
	// ... more props go here
};

export default class TelegrafBot {
	private _id: string;
	private _token: string;
	private _admin: string;
	private _ctx: BotContext;
	public bot;

	public constructor(public options: Record<string, any>) {
		this._id = options.botId;
		this._token = options.botToken;
		this._admin = options.botAdmin;
		this.bot = new Telegraf<BotContext>(options.botToken);
		// Make session data available
		this.bot.use(session());
		this.bot.use(async (ctx, next) => {
			this.ctx = ctx;
			if (options.debug) console.time(`Processing update ${ctx.update.update_id}`);
			if (options.debug) console.info(ctx.update);
			await next(); // runs next middleware
			// runs after next middleware finishes
			if (options.debug) console.timeEnd(`Processing update ${ctx.update.update_id}`);
		});
		this.bot.catch((err) => {
			console.error(err); // err.response, err.on
		});
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
	}

	public start() {


		return this.bot;
	}

	public get ctx(): BotContext {
		return this._ctx;
	}

	public set ctx(context: BotContext) {
		this._ctx = context;
	}

}
