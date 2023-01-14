import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { Errors, ServiceBroker } from 'moleculer';
import FileService from '../../../src/services/api/file.service';
import moleculerConfig from '../../../moleculer.config';

import { DEBUG, VERSION } from '../../../src/config/vars';

describe('Test file service', () => {
	const broker = new ServiceBroker({ logger: false, ...moleculerConfig });
	broker.createService(FileService);

	/*
	const filename = 'banner.png';
	const filePath = join(
		__dirname,
		'../../../public/upload',
		filename
	);
	const stream = createWriteStream(filePath);
	*/

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe('Test file.get action', () => {
		it('should return with true', async () => {
			//const res = await broker.call(`${VERSION}.file.get`, stream, { meta: { filename } });
			const res = await broker.call(`${VERSION}.file.get`, { filename: 'banner.png' });
			console.log(res);
		});
	});

	describe('Test file.upload action', () => {
		it('should reject an ValidationError', async () => {
			expect.assertions(1);
			try {
				await broker.call(`${VERSION}.file.upload`);
			} catch (err) {
				expect(err).toBeInstanceOf(Errors.ValidationError);
			}
		});
	});
});
