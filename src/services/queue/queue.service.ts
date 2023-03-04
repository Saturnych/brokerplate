/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { setTimeout } from 'timers/promises';
import { ServiceBroker } from 'moleculer';
import QueueMixin from 'moleculer-bee-queue';
import BasicService from '../BasicService';

import actions from './queue.actions';

import {
	VERSION,
	SMTP_FROM_EMAIL,
	SMTP_BCC_EMAIL,
	REDIS_HOST,
	REDIS_PORT,
} from '../../config/vars';

const mixins = [QueueMixin({
	redis: {
    host: REDIS_HOST,
		port: REDIS_PORT,
	}
})];

const settings = {
	retries: 2,
};

const emailSend = `${VERSION}.email.send`;

export default class QueueService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'queue'
	) {
		super(broker, {
			name,
			mixins,
			settings,
			actions,
			queues: {
				[emailSend]: async (job) => {
					broker.logger.info(`New job #${job.id} for queue '${job.queue.name}' created with data:`, job.data);
					const paused = await setTimeout(2000, job.reportProgress(job.data)); // report anв wait 2 secs
					broker.logger.info(`Job #${job.id} for queue '${job.queue.name}' reported progress:`, job.status);
					if (job.status === 'retrying' && job.options.retries < 1) {
						return Promise.resolve({
				      done: true,
				      data: job.data,
				      pid: process.pid,
				    });
					} else {
						return Promise.reject(paused);
					}
			  },
			},
		});
	}
}
