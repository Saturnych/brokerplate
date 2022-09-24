/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { NIL } from 'uuid';

export type UUID = string | typeof NIL; // '998d0b5e-7fe2-4bc3-be03-0dfa42c8d715'
export type ISODate = string; // '2021-10-29T21:52:35.830Z'
export type LangCode = string; // 'ru-RU'
export type SafeString = string; // '&lt;div&gt;this is safe string&lt;/div&gt;'
export type Email = string;
export type AuthToken = string;
export type RefreshToken = string;

export interface Entity {
	id: UUID;
}

export interface EntityRef {
	resource: UUID;
}

export interface EntityRefs<EntityType extends Entity> {
	[key: UUID]: EntityType;
}

export interface DbView extends Entity {
	createdAt: ISODate;
	updatedAt: ISODate;
}

export interface UserView extends DbView {
	name: SafeString;
	email: Email;
	active: boolean;
}

export type User = UserView | EntityRef | UUID | null;

export interface ActionReturnData<DataType, ErrorType = Error | null> {
	statusCode: number;
	success: boolean;
	message: string;
	data?: DataType;
	error?: ErrorType;
}

export const returnData: ActionReturnData<null> = {
	statusCode: null,
	success: true,
	message: 'ok',
	data: null,
	error: null,
};
