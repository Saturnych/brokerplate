/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';

import { monitorEventLoopDelay } from 'perf_hooks';

import { DEBUG, VERSION } from '../config/vars';

const defaultEvent = (service: Service, state: string = '') => {
	if (service.debug()) {
		service.logger?.info(`${service.name} event emitted`);
	}
	service.state(state);
};

export default class MoleculerService extends Service {
	protected _debug: boolean = DEBUG;
	protected _state: string = 'down';
	protected _initial: Record<string, any> = {};
	protected _perfhook: Record<string, any> = monitorEventLoopDelay({ resolution: 20 });
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
			[eventsMask]: schema.events || {
				params: {},
				handler: () => {},
			}
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

	public perfhook(): Record<string, any> {
		this._perfhook = monitorEventLoopDelay({ resolution: 20 });
		return this._perfhook;
  }

	public state(st: string = ''): string {
		if (!!st) {
			this._state = st;
		}
		return this._state;
	}
}
