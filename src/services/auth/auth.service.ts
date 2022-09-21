import {ServiceBroker} from 'moleculer';
import BasicService from '../BasicService';

import redis from '../../mixins/redis.mixin';
import actions from './auth.actions';
import events from './auth.events';

import { DEBUG, REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD, REDIS_DB_INDEX } from '../../config/vars';

const options = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  lazyConnect: true,
	user: String(REDIS_USER),
	password: String(REDIS_PASSWORD),
	db: String(REDIS_DB_INDEX),
};

const mixins: any[] = !!options.host ? [ redis({ options }) ] : [];

export default class AuthService extends BasicService {
	public constructor(public broker: ServiceBroker) {
		super(broker, {
			name: 'auth',
			mixins,
			events,
			actions
		});
	}
}
