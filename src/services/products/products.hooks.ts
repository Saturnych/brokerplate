/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context } from 'moleculer';

export default {
	before: {
		/**
		 * Register a before hook for the `create` action.
		 * It sets a default value for the quantity field.
		 *
		 * @param {Context} ctx
		 */
		create: (ctx: Context<{ quantity: number }>) => {
			ctx.params.quantity = 0;
		},
	},
};
