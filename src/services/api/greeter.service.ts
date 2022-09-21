import { ServiceBroker } from 'moleculer';
import BasicService from '../BasicService';

import actions from './greeter.actions';
import events from './greeter.events';

export default class GreeterService extends BasicService {
	public constructor(public broker: ServiceBroker) {
		super(broker, { name: 'greeter', events, actions });
	}
}
