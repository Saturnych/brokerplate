import { ServiceBroker } from 'moleculer';
import MoleculerService from './MoleculerService';

export default class BasicService extends MoleculerService {
	public constructor(broker: ServiceBroker, params: any) {
		super({ broker, ...params });
	}
}
