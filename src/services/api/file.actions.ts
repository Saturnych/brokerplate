/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import FastestValidator from 'fastest-validator'; // https://esm.sh/fastest-validator@1
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { Context } from 'moleculer';
import { VERSION } from '../../config/vars';

const validator = new FastestValidator();
const schemas = {
	get: {
		filename: { type: 'string', min: 1, optional: true },
		originalname: { type: 'string', optional: true },
		mime: { type: 'string', optional: true },
		download: { type: 'boolean', optional: true },
	},
	upload: {
		filename: { type: 'string', min: 1, optional: true },
	},
};

export const GetFile = async ({
	res,
	filename,
	originalname = '',
	contentType = 'image/jpeg',
	download = false,
}) =>
	new Promise((resolve, reject) => {
		const ctx = res.$ctx;
		if (!filename || !contentType)
			return reject(new Error('Wrong filename or contentType!'));
		const filePath = join(__dirname, '../../../public', filename);
		const readStream = createReadStream(filePath);
		readStream.on('error', (err) => {
			if (ctx.service.debug())
				ctx.service.logger.error(
					'createReadStream() error:',
					err.message
				);
			reject(err.message);
		});
		readStream.on('end', () => {
			if (ctx.service.debug())
				ctx.service.logger.info('createReadStream() end!');
			resolve(readStream);
		});
		readStream.pipe(res);
	});

export default {
	/**
	 * Get file action.
	 *
	 */
	get: {
		version: VERSION,
		rest: '/get',
		params: schemas.get,
		type: 'stream',
		handler: async (
			ctx: Context<any, { filename: string }>
		): Promise<any> => {
			const { filename, originalname, mime, download } = ctx.params;
			const params = Object.assign(
				{ filename, originalname, mime, download },
				ctx.meta['$params'],
				ctx.meta
			);
			if (ctx.service.debug())
				ctx.service.logger.info(
					'file.get() params:',
					ctx.meta['$params']
				);
			//schemas.get.filename.optional = undefined;
			//const check = validator.compile(schemas.get);
			//if (!check(params)) throw new Error('Wrong params!');
			if (!params.filename) throw new Error('Wrong filename!');

			return {
				filename: params.filename,
				contentType: params.mime || 'image/png',
				originalname: params.originalname || '',
				download: params.originalname ? true : Boolean(params.download),
				GetFile,
			};
		},
	},

	/**
	 * Save file action.
	 *
	 */
	upload: {
		version: VERSION,
		rest: '/upload',
		params: {
			filename: 'string',
		},
		type: 'stream', // multipart
		handler: async (
			ctx: Context<any, { filename: string }>
		): Promise<string> =>
			new Promise((resolve, reject) => {
				if (ctx.service.debug())
					ctx.service.logger.info(
						'file.upload() ctx.params:',
						JSON.stringify(ctx.params)
					);
				if (!ctx.params.filename) reject(new Error('Wrong filename!')); // meta?
				const filePath = join(
					__dirname,
					'../../../public/upload',
					ctx.params.filename
				);
				const f = createWriteStream(filePath);
				f.on('close', () => {
					if (ctx.service.debug())
						ctx.service.logger.info(
							`Uploaded file stored in '${filePath}'`
						);
					resolve(filePath);
				});
				f.on('error', (err) => reject(err));
				ctx.params.pipe(f);
			}),
	},
};
