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

import TelegrafBot from './telegrafbot.class';

const mixin = ({ key = 'telegraf', options }) => ({
	settings: {
		[key]: options,
	},
	created() {
		const bots = {};
		for (const id of Object.keys(options)) {
			bots[id] = new TelegrafBot(options[id]);
		}
		this[key] = {
			bots,
		};
	},
	started() {
		for (const id of Object.keys(options)) {
			if (options[id].debug)
				this[key].bots[id].telegram.sendMessage(
					options[id].admin,
					`bot #${id} started`
				);
		}
	},
	stopped() {
		for (const id of Object.keys(options)) {
			if (options[id].debug)
				this[key].bots[id].telegram.sendMessage(
					options[id].admin,
					`bot #${id} stopped`
				);
			this[key].bots[id].stop('SERVICESTOPPED');
		}
	},
});

export default mixin;
