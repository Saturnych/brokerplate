/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

export default {
	// Available fields in the responses
	fields: ['_id', 'title', 'description'],
	// Validator for the `create` & `insert` actions.
	entityValidator: {
		title: 'string|min:3',
	},
};
