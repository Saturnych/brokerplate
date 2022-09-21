export default {
	// Available fields in the responses
	fields: ['_id', 'name', 'quantity', 'price'],
	// Validator for the `create` & `insert` actions.
	entityValidator: {
		name: 'string|min:3',
		price: 'number|positive',
	},
};
