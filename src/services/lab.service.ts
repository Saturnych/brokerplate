/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Service, ServiceBroker, ServiceSchema } from 'moleculer';
import { AgentService } from '@moleculer/lab';

import { DEBUG, VERSION, LAB_TOKEN, LAB_APIKEY } from '../config/vars';

export default class LabService extends Service {
	public constructor(broker: ServiceBroker) {
		super(broker);
		const schema: ServiceSchema = {
			name: 'lab',
			version: VERSION,
			mixins: [AgentService],
			settings: {
				token: LAB_TOKEN,
				apiKey: LAB_APIKEY,
			},
			events: {
				'**': (payload: Buffer, sender: string, event: string) => {
					if (DEBUG)
						this.logger.debug(
							`${this.name}.events('**'): payload = ${
								JSON.stringify(payload).length
							}, sender = ${sender}, event = ${event}`
						);
				},
			},
		};
		this.parseServiceSchema(schema);
	}
}
