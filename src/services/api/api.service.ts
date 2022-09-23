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
import actions from './api.actions';

export default class ApiService extends WebService {
	public constructor(public broker: ServiceBroker, public name: string = 'api') {
		super(broker, { name, settings, methods, actions });
	}
}
