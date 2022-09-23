/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';

import { DEBUG, VERSION } from '../config/vars';

const defaultEvent = (service: Service, state: string = '') => {
	if (service.debug()) {
		service.logger?.info(`${service.name} event emitted`);
	}
	service.state(state);
};

export default class MoleculerService extends Service {
	protected _debug: boolean = DEBUG;
	protected _initial: Record<string, any> = {};
	protected _state: string = 'down';
	public name: string = 'service';

	public constructor(params: any) {
		super(params.broker);
		this.name = params.name;
		const {
			broker,
			stopped = defaultEvent(this, 'down'),
			created = defaultEvent(this),
			started = defaultEvent(this),
			afterConnected = defaultEvent(this),
			...schema
		} = params;
		this.state('up');
		const eventsMask = `${this.name}.*`;
		this.events = {
			'**': (payload: Buffer, sender: string, event: string) => {
				//if (this.debug()) this.logger.debug(`${this.name}.events('**'): payload = ${JSON.stringify(payload)}, sender = ${sender}, event = ${event}`);
			},
			'node.broken': (node: any) => {
				this.logger.warn(
					`${this.name}: '${node.id}' node is disconnected!`
				);
			},
		};
		this.events[eventsMask] = schema.events || {
			params: {},
			handler: () => {},
		};
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

	public state(st: string = ''): string {
		if (!!st) {
			this._state = st;
		}
		return this._state;
	}
}
