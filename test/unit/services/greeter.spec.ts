import {Errors, ServiceBroker} from 'moleculer';
import GreeterService from '../../../src/services/api/greeter.service';
import moleculerConfig from '../../../moleculer.config';

describe('Test greeter service', () => {
	const broker = new ServiceBroker({ logger: false, ...moleculerConfig });
	broker.createService(GreeterService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe('Test greeter.hello action', () => {
		it('should return with Hello Moleculer', async () => {
			const res = await broker.call('v1.greeter.hello');
			expect(res).toBe('Hello Moleculer');
		});
	});

	describe('Test greeter.welcome action', () => {
		it('should return with Welcome', async () => {
			const res = await broker.call('v1.greeter.welcome', { name: 'Adam' });
			expect(res).toBe('Welcome, Adam');
		});

		it('should reject an ValidationError', async () => {
			expect.assertions(1);
			try {
				await broker.call('v1.greeter.welcome');
			} catch (err) {
				expect(err).toBeInstanceOf(Errors.ValidationError);
			}
		});
	});
});
