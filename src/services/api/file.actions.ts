/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { createWriteStream } from 'fs';
import { join } from 'path';
import { Context } from 'moleculer';
import { VERSION } from '../../config/vars';

export default {
	/**
	 * Save file action.
	 *
	 */
	save: {
		version: VERSION,
		handler: async (
			ctx: Context<any, { filename: string }>
		): Promise<string> =>
			new Promise((resolve, reject) => {
				if (ctx.meta.filename) reject(new Error('Wrong filename!'));
				const filePath = join(
					__dirname,
					'public/upload',
					ctx.meta.filename
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
