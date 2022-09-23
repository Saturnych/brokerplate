/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import DbService from '../DbService';

import settings from './products.settings';
import hooks from './products.hooks';
import actions from './products.actions';
import methods from './products.methods';

export default class ProductsService extends DbService {
	public constructor(public broker: ServiceBroker, public name: string = 'products') {
		super(broker, {
			model: 'Products',
			name,
			settings,
			hooks,
			actions,
			methods,
			afterConnected: () => {
				if (this.debug()) {
					this.logger.debug(`${this.name}.afterConnected()`);
				}
			},
		});
	}
}
