import io from 'socket.io-client';
import {Errors, ServiceBroker} from 'moleculer';
import GreeterService from '../../../src/services/api/greeter.service';
import IoService from '../../../src/services/io.service';
import moleculerConfig from '../../../moleculer.config';

import { DEBUG, VERSION, SOCKET_IO_PORT } from '../../../src/config/vars';

describe('Test io service', () => {
	const broker = new ServiceBroker(moleculerConfig); // { logger: false, ...moleculerConfig }
	broker.createService(GreeterService);
	broker.createService(IoService);

	var socket;

	beforeAll(() => {
		broker.start();
		socket = io(`http://localhost:${SOCKET_IO_PORT}`);
	});

	afterAll(() => {
		if (socket) socket.disconnect();
		broker.stop();
	});

	describe('Test io.call.welcome action', () => {
		it('should return with Welcome, Test', async () => {
			socket.emit('call', `${VERSION}.greeter.welcome`, { name: 'Test' }, (err, res) => {
			  if (err) {
			    broker.logger.error(err);
			  } else {
			    broker.logger.info('call success:', res);
					expect(res).toBe('Welcome, Test');
			  }
			});
		});

		it('should reject an ValidationError', async () => {
			socket.emit('call', `${VERSION}.greeter.welcome`, {}, (err, res) => {
				expect.assertions(1);
				if (err) {
			    broker.logger.error(err);
					expect(err).toBeInstanceOf(Errors.ValidationError);
			  } else {
			    broker.logger.info('call success:', res);
			  }
			});
		});
	});

	describe('Test io.welcome action', () => {
		it('should return with Welcome, Test', async () => {
			socket.emit('welcome', 'test', {}, (err, res) => {
			  if (err) {
			    broker.logger.error(err);
			  } else {
			    broker.logger.info('call success:', res);
					expect(res).toBe('Welcome, Io');
			  }
			});
		});
	});

});
