/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context } from 'moleculer';

import { VERSION } from '../../config/vars';

export default {
	/**
	 * Default REST actions:
	 *  - list
	 *  - find
	 *  - count
	 *  - create
	 *  - insert
	 *  - update
	 *  - remove
	 */
	/**
	 * Increase the quantity of the product item.
	 */
	increaseQuantity: {
		version: VERSION,
		rest: 'PUT /:id/quantity/increase',
		params: {
			id: 'string',
			// @ts-ignore
			value: 'number|integer|positive',
		},
		handler: async (ctx: Context<{ id: string; value: number }>) => {
			// Const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: ctx.params.value } });
			// Const json = await this.transformDocuments(ctx, ctx.params, doc);
			// Await this.entityChanged('updated', json, ctx);
			// Return json;
		},
	},

	/**
	 * Decrease the quantity of the product item.
	 */
	decreaseQuantity: {
		version: VERSION,
		rest: 'PUT /:id/quantity/decrease',
		params: {
			id: 'string',
			// @ts-ignore
			value: 'number|integer|positive',
		},
		/** @param {Context} ctx  */
		handler: async (ctx: Context<{ id: string; value: number }>) => {
			// Const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: -ctx.params.value } });
			// Const json = await this.transformDocuments(ctx, ctx.params, doc);
			// Await this.entityChanged('updated', json, ctx);
			// Return json;
		},
	},
};
