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

import { getPerfhookInfo } from '../utils';

import { DEBUG, VERSION } from '../config/vars';

const defaultEvent = (service: Service, state: string = '') => {
	if (service?.debug()) {
		service.logger?.info(`${service.name} event emitted`);
	}
	service.state(state);
};

export default class MoleculerService extends Service {
	protected _debug: boolean = DEBUG;
	protected _state: string = 'down';
	protected _initial: Record<string, any> = {};
	protected _perfhook = monitorEventLoopDelay({ resolution: 20 });
	public name: string = 'service';

	public constructor(params: any) {
		super(params.broker);
		this.name = params.name;
		const {
			broker,
			stopped,
			created,
			started,
			...schema
		} = params;
		const eventsMask = `${this.name}.*`;
		this.events = {
			[eventsMask]: schema.events || {
				params: {},
				handler: () => {},
			}
		};
		schema.events = this.events;
		schema.created = created || this.serviceCreated;
		schema.started = started || this.serviceStarted;
		schema.stopped = stopped || this.serviceStopped;
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

	public perfhook(enabled: boolean | undefined): Record<string, any> {
		if (String(enabled)==='true') this._perfhook.enable();
		else if (String(enabled)==='false') this._perfhook.disable();
		return this._perfhook;
  }

	public state(st: string = ''): string {
		if (!!st) this._state = st;
		return this._state;
	}

	public serviceCreated() {
    if (this._debug) this.logger.info(`+++ ${this.name}.serviceCreated()`);
    this.state('starting');
		const perfhook = this.perfhook(true);
		if (this._debug) this.logger.info(`+++ ${this.name}.perfhook:`, getPerfhookInfo(perfhook));
    return ('serviceCreated' in this.events)?this.events.serviceCreated(this):null;
  }

  public serviceStarted() {
    if (this._debug) this.logger.info(`+++ ${this.name}.serviceStarted()`);
    this.state('up');
    return ('serviceStarted' in this.events)?this.events.serviceStarted(this):null;
  }

  public serviceStopped() {
    if (this._debug) this.logger.info(`--- ${this.name}.serviceStopped()`);
    this.state('down');
		const perfhook = this.perfhook(false);
    if (this._debug) this.logger.info(`--- ${this.name}.perfhook:`, getPerfhookInfo(perfhook));
    return ('serviceStopped' in this.events)?this.events.serviceStopped(this):null;
  }
}
