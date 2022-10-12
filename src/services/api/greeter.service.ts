/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import BasicService from '../BasicService';

import actions from './greeter.actions';

export default class GreeterService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'greeter'
	) {
		super(broker, { name, actions });
	}
}
