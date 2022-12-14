/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API config
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { config } from 'dotenv';
config();

import { isNumeric } from '../utils';

export const NODE_ENV: string = process.env.NODE_ENV || ''; // 'test' - for NeDB MemoryAdapter usage
export const DEV_MODE: boolean = !!NODE_ENV && NODE_ENV.indexOf('dev') > -1;
export const DEBUG = !!DEV_MODE;

// // Moleculer
export const SERVICEDIR: string = process.env.SERVICEDIR || '';
export const SERVICES: string = process.env.SERVICES || '';
export const APP_NAME: string = process.env.APP_NAME || 'app';
export const VERSION: string = process.env.VERSION || 'v0';
export const LAB_TOKEN: string = process.env.LAB_TOKEN || '';
export const LAB_APIKEY: string = process.env.LAB_APIKEY || '';
export const TRANSPORTER: string = process.env.TRANSPORTER || '';
export const CACHER_REDIS: string = process.env.CACHER_REDIS || '';

// // Redis
export const REDIS_HOST: string = process.env.REDIS_HOST || '';
export const REDIS_PORT: number = isNumeric(process.env.REDIS_PORT)
	? Number(process.env.REDIS_PORT)
	: 6379; // 11888
export const REDIS_USER: string = process.env.REDIS_USER || '';
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || '';
export const REDIS_DB_INDEX: number = isNumeric(process.env.REDIS_DB_INDEX)
	? Number(process.env.REDIS_DB_INDEX)
	: 0;

// // Socket.io
export const SOCKET_IO_PORT: number = isNumeric(process.env.SOCKET_IO_PORT)
	? Number(process.env.SOCKET_IO_PORT)
	: 3000;

// // PG
export const POSTGRES_HOST: string = process.env.POSTGRES_HOST || 'pg';
export const POSTGRES_PORT: number = isNumeric(process.env.POSTGRES_PORT)
	? Number(process.env.POSTGRES_PORT)
	: 5432;
export const POSTGRES_USER: string = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD: string =
	process.env.POSTGRES_PASSWORD || 'test';
export const POSTGRES_DB: string = process.env.POSTGRES_DB || 'test';
export const POSTGRES_URI: string = process.env.POSTGRES_URI || '';

// // MongoDB
export const MONGO_URI: string = process.env.MONGO_URI || '';

// // Passwords
export const SALT_WORK_FACTOR: number = isNumeric(process.env.SALT_WORK_FACTOR)
	? Number(process.env.SALT_WORK_FACTOR)
	: 10;

// // Authentication/Authorization
export const REFRESH_TOKEN_SECRET: string =
	process.env.REFRESH_TOKEN_SECRET || 'REFRESH-TOKEN-SECRET';
export const ACCESS_TOKEN_SECRET: string =
	process.env.ACCESS_TOKEN_SECRET || 'ACCESS-TOKEN-SECRET';
export const ACCESS_TOKEN_EXPIRES: string =
	process.env.ACCESS_TOKEN_EXPIRES || '180m';
export const ACCESS_TOKEN_EXPIRES_SEC: number = isNumeric(
	process.env.ACCESS_TOKEN_EXPIRES_SEC
)
	? Number(process.env.ACCESS_TOKEN_EXPIRES_SEC)
	: 180 * 60;
