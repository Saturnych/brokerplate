import { ServiceBroker } from 'moleculer';
import WebMixin from 'moleculer-web';
import MoleculerService from './MoleculerService';

export default class WebService extends MoleculerService {
	public constructor(broker: ServiceBroker, params: any) {
		super({ broker, mixins: [WebMixin], ...params });
	}
}
