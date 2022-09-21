import {ServiceBroker} from 'moleculer';
import WebService from '../WebService';

import settings from './api.settings';
import methods from './api.methods';
import events from './api.events';

export default class ApiService extends WebService {
	public constructor(broker: ServiceBroker) {
		super(broker, { name: 'api', settings, methods, events });
	}
}
