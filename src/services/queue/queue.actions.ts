/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Errors, Context } from 'moleculer';
import { VERSION } from '../../config/vars';

export default {
	/**
	 * Ping action.
	 *
	 */
	ping: {
		version: VERSION,
		params: {},
		handler: async (ctx: Context): Promise<string> => {
			const { service } = ctx;
			if (service.debug())
				service.logger.info(
					'queue.ping() service.settings.retries:',
					service.settings.retries
				);
			return service.settings.retries
				? Promise.resolve('pong')
				: Promise.reject('');
		},
	},

	/**
	 * GetQueue action.
	 *
	 */
	getQueue: {
		version: VERSION,
		params: {
			name: 'string',
		},
		handler: async (
			ctx: Context<{ name: string; }>
		): Promise<any> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info(
					'queue.getQueue() params:',
					params
				);
			return service.getQueue(params.name);
		},
	},

	/**
	 * CreateJob action.
	 *
	 */
	createJob: {
		version: VERSION,
		params: {
			name: 'string',
			data: 'object',
			retries: 'number|optional',
		},
		handler: async (
			ctx: Context<{ name: string; data: Record<string, any>; retries?: number; }>
		): Promise<any> => {
			const { params, service } = ctx;
			if (service.debug())
				service.logger.info('queue.createJob() params:', params);

			if (!!!params.retries)
				params.retries = service.settings.retries;

			const job = service.createJob(params.name, params.data);

	    job.on('progress', progress => {
	      service.logger.info(`Job '${job.queue.name}' progress:`, progress);
	    });

	    job.on('failed', err => {
	      service.logger.info(`Job '${job.queue.name}' failed!. Error:`, err);
	    });

			job.on('succeeded', res => {
	      service.logger.info(`Job '${job.queue.name}' succeeded!. Job result:`, res);
	    });

	    job.retries(params.retries).save();

			if (service.debug())
				service.logger.info(`Job '${job.queue.name}' created.`);
			return job;
		},
	},
};
