/**
 * Copyright (c) 2022
 *
 * @summary Moleculer Telegraf mixin
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin TelegrafMixin
 *
 */

import { session, Context, Telegraf } from 'telegraf';

interface SessionData {
	messageCount: number;
	// ... more session data go here
};

// Define your own context type
interface BotContext extends Context {
	session?: SessionData;
	// ... more props go here
};

const mixin = ({ key = 'telegraf', options }) => ({
	settings: {
		[key]: options,
	},
	created() {
		const { debug, botToken } = this.settings[key];
		this[key] = new Telegraf<BotContext>(botToken);
		// Make session data available
		this[key].use(session());
		this[key].use(async (ctx, next) => {
		  if (debug) console.time(`Processing update ${ctx.update.update_id}`);
			if (debug) console.info(ctx.update);
		  await next(); // runs next middleware
		  // runs after next middleware finishes
		  if (debug) console.timeEnd(`Processing update ${ctx.update.update_id}`);
		});
		this[key].catch((err) => {
		  console.error(err.response, err.on);
		});
		process.once('SIGINT', () => this[key].stop('SIGINT'));
		process.once('SIGTERM', () => this[key].stop('SIGTERM'));
	},
	started() {
	},
	stopped() {
		this[key].stop('SERVICESTOPPED');
	},
});

export default mixin;
