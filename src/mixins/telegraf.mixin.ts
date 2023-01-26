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
		[key]: options
	},
	created() {
		const bots = {};
		for (let id of Object.keys(options)) {
	    bots[id] = new TelegrafBot(options[id])
		}
		this[key] = {
			bots
		};
	},
	started() {
		if (options.debug) {
			for (let id of Object.keys(options)) {
		    this[key].bots[id].telegram.sendMessage(options[id].admin, `bot #${id} started`);
			}
		}
	},
	stopped() {
		for (let id of Object.keys(options)) {
			if (options.debug) this[key].bots[id].telegram.sendMessage(options[id].admin, `bot #${id} stopped`);
			this[key].bots[id].stop('SERVICESTOPPED');
		}
	},
});

export default mixin;
