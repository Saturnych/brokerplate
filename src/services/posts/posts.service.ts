/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import DbService from '../DbService';

import settings from './posts.settings';
import hooks from './posts.hooks';
import actions from './posts.actions';
import methods from './posts.methods';

export default class PostService extends DbService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'posts'
	) {
		super(broker, {
			model: 'Posts',
			name,
			settings,
			hooks,
			actions,
			methods,
		});
	}
}
