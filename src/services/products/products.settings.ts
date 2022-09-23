/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

export default {
	// Available fields in the responses
	fields: ['_id', 'name', 'quantity', 'price'],
	// Validator for the `create` & `insert` actions.
	entityValidator: {
		name: 'string|min:3',
		price: 'number|positive',
	},
};
