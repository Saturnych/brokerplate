import { ServiceBroker } from 'moleculer';
import DbService from '../DbService';

import settings from './posts.settings';
import hooks from './posts.hooks';
import actions from './posts.actions';
import methods from './posts.methods';

export default class PostService extends DbService {
	public constructor(public broker: ServiceBroker) {
		super(broker, { name: 'posts', settings, hooks, actions, methods });
	}
}
