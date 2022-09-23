/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context } from 'moleculer';

export type HealthData = {
	name: string;
	state: string;
	timestamp: number;
	uptime?: number;
};

export default {
	/**
	 * Health action.
	 *
	 */
	health: {
		rest: {
			method: 'GET',
			path: '/health',
		},
		handler: async (ctx: Context): Promise<HealthData> => {
			if (ctx.service.debug())
				ctx.service.logger.info('api.health()');
			return {
				name: ctx.service.name,
				state: ctx.service.state(),
				timestamp: Date.now(),
				uptime: process && process.uptime(),
			};
		},
	},

};
