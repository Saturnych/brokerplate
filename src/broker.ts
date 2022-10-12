/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API ServiceBroker
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { existsSync } from 'fs';
import { ServiceBroker } from 'moleculer';
import moleculerConfig from '../moleculer.config';

import { DEV_MODE, SERVICEDIR, SERVICES } from './config/vars';

const serviceList = SERVICES ? SERVICES.split(',') : [];
const serviceDir =
	!!SERVICEDIR && existsSync(SERVICEDIR) ? SERVICEDIR : './services';

let services: Record<string, any> = {};
if (serviceList.length > 0) {
	serviceList.forEach((serv) => {
		services[serv.split('.')[0] as string] =
			require(`${serviceDir}/${serv}`).default;
	});
} else {
	services = require(serviceDir).default as Record<string, any>;
}

const broker = new ServiceBroker(moleculerConfig);
for (const [name, service] of Object.entries(services))
	broker.createService(service);

broker
	.start()
	.then(() => {
		broker.logger.warn(
			`++++ ${moleculerConfig.nodeID} services broker started ++++`
		);
		// Switch to REPL mode at development
		if (DEV_MODE) broker.repl();
	})
	.catch((err) => {
		if (broker)
			broker.logger.error(
				`---- ${moleculerConfig.nodeID} services broker error: ${err} ----`
			);
	});

export default broker;
