/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API hooks
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { IncomingMessage, ServerResponse } from 'http';
import { Errors, Context } from 'moleculer';
const { ValidationError } = Errors;

import { ActionReturnData, UserView } from '../types';
import { resObj, resError } from '../utils';

/**
 * Before call hook. You can check the request.
 * @param {Context} ctx
 * @param {Object} route
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {Object} data
 **/
export const onBeforeCall = async (
	ctx: Context<any, { headers: Record<string, any> }>,
	route: Record<string, any>,
	req: IncomingMessage,
	res: ServerResponse
): Promise<void> => {
	if (ctx.service.debug())
		ctx.service.logger.info('api.onBeforeCall() meta:', ctx.meta);
	if (
		route.checkHeaders &&
		Array.isArray(route.checkHeaders) &&
		route.checkHeaders
			.map((x) => x.toLowerCase())
			.filter((h) =>
				Object.keys(req.headers)
					.map((x) => x.toLowerCase())
					.includes(h)
			).length !== route.checkHeaders.length
	)
		throw new ValidationError('Headers validation error!');
	// Set request headers to context meta
	ctx.meta = {
		headers: req.headers,
		...ctx.meta,
	};
};

/**
 * After call hook. You can modify the data.
 * @param {Context} ctx
 * @param {Object} route
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {Object} data
 **/
export const onAfterCall = async (
	ctx: Context<
		any,
		{
			user: UserView;
			$statusCode: number;
			$location: string;
			$responseType: string;
			$responseHeaders: Record<string, string>;
		}
	>,
	route: Record<string, any>,
	req: IncomingMessage,
	res: ServerResponse,
	data: any
): Promise<ActionReturnData<any> | any> => {
	if (ctx.service.debug())
		ctx.service.logger.info(
			'api.onAfterCall() meta:',
			ctx.meta,
			'data.length:',
			Object.keys(data).length
		);
	// redirects
	if (data.redirect) {
		ctx.meta.$statusCode = res.statusCode = 302;
		ctx.meta.$location = data.redirect.trim();
		res.setHeader('Location', data.redirect.trim());
		return data;
	}
	ctx.meta.$statusCode = res.statusCode = 200;
	// file download
	const contentType = (data.contentType || '').trim();
	if (!!contentType && data.filename && data.GetFile) {
		let contentDisposition =
			String(data.download || 0) === '1' ? 'attachment' : 'inline';
		if (data.originalname && String(data.originalname).length > 0) {
			contentDisposition = `${contentDisposition}; filename=${data.originalname}`;
		}
		ctx.meta.$responseHeaders = {
			'Content-Disposition': contentDisposition,
		};
		ctx.meta.$responseType = contentType;
		res.setHeader('Content-Disposition', contentDisposition);
		res.setHeader('Content-Type', contentType); // text/csv // image/jpeg
		const file = await data.GetFile({ res, ...data });
		if (ctx.service.debug())
			ctx.service.logger.info('onAfterCall.GetFile() file');
		if (file) return file;
	}
	if (ctx.meta.user)
		res.setHeader('X-Plate-User', ctx.meta.user.id as string);
	const ret: ActionReturnData<any> = resObj<any>({ data });
	return !!data.metadata ||
		(Array.isArray(data) &&
			(!!data[0].instanceID || data[0].name?.indexOf('$node') > -1))
		? data
		: ret;
};

export const onError = async (
	req: IncomingMessage,
	res: ServerResponse,
	err: Error | any
): Promise<void> => resError(req, res, err);
