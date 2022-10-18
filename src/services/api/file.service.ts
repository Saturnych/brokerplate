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

import actions from './file.actions';

export default class FileService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'file'
	) {
		super(broker, { name, actions });
	}
}
