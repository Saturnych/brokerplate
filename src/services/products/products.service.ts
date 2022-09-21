import { ServiceBroker } from 'moleculer';
import DbService from '../DbService';

import settings from './products.settings';
import hooks from './products.hooks';
import actions from './products.actions';
import methods from './products.methods';

export default class ProductsService extends DbService {
	public constructor(public broker: ServiceBroker) {
		super(broker, {
			name: 'products',
			model: 'Products',
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
