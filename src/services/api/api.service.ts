/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { IncomingMessage, ServerResponse } from 'http';
import { ServiceBroker } from 'moleculer';
import WebService from '../WebService';
import { resError } from '../../utils';
import { DEBUG } from '../../config/vars';

import settings from './api.settings';
import methods from './api.methods';
import actions from './api.actions';

export default class ApiService extends WebService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'api'
	) {
		super(broker, {
			name,
			methods,
			actions,
			settings: {
				onError: (
					req: IncomingMessage,
					res: ServerResponse,
					err: Error | any
				) => resError(req, res, err, broker.logger, DEBUG),
				...settings,
			},
		});
	}
}
