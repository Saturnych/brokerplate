/**
 * Copyright (c) 2022
 *
 * @summary Moleculer Redis mixin
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin RedisMixin
 *
 */

import Redis from 'ioredis';

const RedisMixin = ({ key = 'redis', options }) => ({
	settings: {
		[key]: options,
	},
	created() {
		this[key] = new Redis(this.settings[key]);
	},
	async started() {
		await this[key].connect();
	},
	stopped() {
		this[key].disconnect();
	},
});

export default RedisMixin;
