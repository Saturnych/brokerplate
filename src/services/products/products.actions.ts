import { Context } from 'moleculer';

export default {
	/**
	 * The 'moleculer-db' mixin registers the following actions:
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
