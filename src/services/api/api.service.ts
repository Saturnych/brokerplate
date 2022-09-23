/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import WebService from '../WebService';

import settings from './api.settings';
import methods from './api.methods';

export default class ApiService extends WebService {
	public constructor(broker: ServiceBroker) {
		super(broker, { name: 'api', settings, methods });
	}
}
