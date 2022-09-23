/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import DbConnection from '../mixins/db.mixin';
import MoleculerService from './MoleculerService';

export default class DbService extends MoleculerService {
	public constructor(broker: ServiceBroker, params: any) {
		super({
			broker,
			mixins: [new DbConnection(params.name).start()],
			...params,
		});
	}
}
