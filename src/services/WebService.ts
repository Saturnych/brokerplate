/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import WebMixin from 'moleculer-web';
import MoleculerService from './MoleculerService';

export default class WebService extends MoleculerService {
	public constructor(broker: ServiceBroker, params: any) {
		super({ broker, mixins: [WebMixin], ...params });
	}
}
