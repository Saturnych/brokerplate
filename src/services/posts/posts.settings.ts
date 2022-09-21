export default {
	// Available fields in the responses
	fields: ['_id', 'title', 'description'],
	// Validator for the `create` & `insert` actions.
	entityValidator: {
		title: 'string|min:3',
	},
};
