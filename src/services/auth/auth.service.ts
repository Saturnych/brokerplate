/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { ServiceBroker } from 'moleculer';
import BasicService from '../BasicService';

import redis from '../../mixins/redis.mixin';
import actions from './auth.actions';

import {
	REDIS_HOST,
	REDIS_PORT,
	REDIS_USER,
	REDIS_PASSWORD,
	REDIS_DB_INDEX,
	REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRES,
	ACCESS_TOKEN_EXPIRES_SEC,
} from '../../config/vars';

const options = {
	host: REDIS_HOST,
	port: Number(REDIS_PORT),
	lazyConnect: true,
	user: String(REDIS_USER),
	password: String(REDIS_PASSWORD),
	db: String(REDIS_DB_INDEX),
};

const mixins = options.host ? [redis({ options })] : [];

export default class AuthService extends BasicService {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'auth'
	) {
		super(broker, {
			name,
			mixins,
			actions,
		});

		this._initial = {
			rts: REFRESH_TOKEN_SECRET,
			ats: ACCESS_TOKEN_SECRET,
			expires: ACCESS_TOKEN_EXPIRES,
			expiresSec: ACCESS_TOKEN_EXPIRES_SEC,
		};
	}
}
