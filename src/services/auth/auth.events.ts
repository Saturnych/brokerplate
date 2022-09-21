import { Context } from 'moleculer';

export default {
	params: {},
	handler: (ctx: Context) => {
		if (ctx.service.debug()) ctx.service.logger.info('greeter.events');
	},
};
