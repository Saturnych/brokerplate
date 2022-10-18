import {Errors, ServiceBroker} from 'moleculer';
import GreeterService from '../../../src/services/api/greeter.service';
import IoService from '../../../src/services/io.service';
import moleculerConfig from '../../../moleculer.config';
import io from 'socket.io-client';

describe('Test io service', () => {
	const broker = new ServiceBroker(moleculerConfig); // { logger: false, ...moleculerConfig }
	broker.createService(GreeterService);
	broker.createService(IoService);

	var socket;

	beforeAll(() => {
		broker.start();
		socket = io('http://localhost:3000');
	});

	afterAll(() => {
		if (socket) socket.disconnect();
		broker.stop();
	});

	describe('Test io.call.welcome action', () => {
		it('should return with Welcome, Test', async () => {
			socket.emit('call', 'v1.greeter.welcome', { name: 'Test' }, (err, res) => {
			  if (err) {
			    console.error(err);
			  } else {
			    console.log('call success:', res);
					expect(res).toBe('Welcome, Test');
			  }
			});
		});

		it('should reject an ValidationError', async () => {
			socket.emit('call', 'v1.greeter.welcome', {}, (err, res) => {
				expect.assertions(1);
				if (err) {
			    console.error(err);
					expect(err).toBeInstanceOf(Errors.ValidationError);
			  } else {
			    console.log('call success:', res);
			  }
			});
		});
	});

	describe('Test io.welcome action', () => {
		it('should return with Welcome, Test', async () => {
			socket.emit('welcome', 'test', {}, (err, res) => {
			  if (err) {
			    console.error(err);
			  } else {
			    console.log('call success:', res);
					expect(res).toBe('Welcome, Io');
			  }
			});
		});
	});

});
