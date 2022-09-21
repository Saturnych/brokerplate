import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';

import { DEBUG, VERSION } from '../config/vars';

const defaultEvent = (service: Service) => {
	if (service.debug()) {
		service.logger?.info(`${service.name} event emitted`);
	}
};

export default class MoleculerService extends Service {
	public _debug: boolean = DEBUG;
	public _initial: Record<string, any> = {};
	public _state = 'down';
	public name = 'service';

	public constructor(params: any) {
		super(params.broker);
		this.name = params.name;
		const {
			broker,
			afterConnected = defaultEvent(this),
			created = defaultEvent(this),
			started = defaultEvent(this),
			stopped = defaultEvent(this),
			...schema
		} = params;
		const eventsMask = `${this.name}.*`;
		this.events = {
			'**': (payload: any, sender: any, event: any) => {
				// If (this.debug()) this.logger.debug(`${this.name}.events('**'): payload = ${JSON.stringify(payload)}, sender = ${sender}, event = ${event}`);
			},
			'node.broken': (node: any) => {
				this.logger.warn(
					`${this.name}: '${node.id}' node is disconnected!`
				);
			},
		};
		this.events[eventsMask] = schema.events || {};
		schema.events = this.events;
		schema.afterConnected = afterConnected;
		schema.created = created;
		schema.started = started;
		schema.stopped = stopped;
		schema.version = VERSION;
		schema.meta = { scalable: true };
		schema.dependencies = [];
		this.parseServiceSchema(schema as ServiceSchema);
	}

	public debug(): boolean {
		return this._debug;
	}

	public initial(): Record<string, any> {
		return this._initial;
	}

	public state(st = ''): string {
		if (st) {
			this._state = st;
		}
		return this._state;
	}
}
