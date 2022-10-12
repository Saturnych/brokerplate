/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import MoleculerService from './MoleculerService';

export default class BasicService extends MoleculerService {
	public constructor(broker: ServiceBroker, params: any) {
		super({ broker, ...params });
	}
}
