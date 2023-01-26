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
		const { debug, botToken, botId } = this.settings[key];
		this[key] = {
			bots: {},
		};

		const bot = new Telegraf<BotContext>(botToken);
		// Make session data available
		bot.use(session());
		bot.use(async (ctx, next) => {
		  if (debug) console.time(`Processing update ${ctx.update.update_id}`);
			if (debug) console.info(ctx.update);
		  await next(); // runs next middleware
		  // runs after next middleware finishes
		  if (debug) console.timeEnd(`Processing update ${ctx.update.update_id}`);
		});
		bot.catch((err) => {
		  console.error(err); // err.response, err.on
		});
		process.once('SIGINT', () => bot.stop('SIGINT'));
		process.once('SIGTERM', () => bot.stop('SIGTERM'));
		this[key].bots[botId] = bot;
	},
	started() {
		const { debug, botId, botAdmin } = this.settings[key];
		if (debug) this[key].bots[botId].telegram.sendMessage(botAdmin, `bot ${botId} started`);
	},
	stopped() {
		const { botId } = this.settings[key];
		this[key].bots[botId].stop('SERVICESTOPPED');
	},
});

export default mixin;
