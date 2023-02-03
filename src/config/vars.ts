/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API config
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') config();

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
export const TRANSPORTER: string = process.env.TRANSPORTER || ''; // nats://localhost:4222
export const CACHER: string = process.env.CACHER || ''; // redis://localhost:6379

// // Telegram
export const TELEGRAM_TOKEN: string = process.env.TELEGRAM_TOKEN || '';
export const TELEGRAM_CHANNEL: string = process.env.TELEGRAM_CHANNEL || '';

// // FCM
export const FCM_DEBUG = !!process.env.FCM_DEBUG;
export const FCM_PROJECT_ID: string = process.env.FCM_PROJECT_ID || '';
export const FCM_SENDER_ID: string = process.env.FCM_SENDER_ID || '';
export const FCM_TOPIC: string = process.env.FCM_TOPIC || '';
export const FCM_SERVICE_ACCOUNT: string =
	process.env.FCM_SERVICE_ACCOUNT || '';

// // Twilio
export const TWILIO_ACCOUNT_SID: string = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN: string = process.env.TWILIO_AUTH_TOKEN || '';
export const TWILIO_SERVICE_NAME: string =
	process.env.TWILIO_SERVICE_NAME || 'Brokerplate';
export const TWILIO_SERVICE_CHANNEL: string =
	process.env.TWILIO_SERVICE_CHANNEL || 'sms';
export const TWILIO_TEST_PHONE: string = process.env.TWILIO_TEST_PHONE || '';

// // SMTP
export const SMTP_HOST: string = process.env.SMTP_HOST || '';
export const SMTP_PORT: number = isNumeric(process.env.SMTP_PORT)
	? Number(process.env.SMTP_PORT)
	: 465;
export const SMTP_USER: string = process.env.SMTP_USER || '';
export const SMTP_PASS: string = process.env.SMTP_PASS || '';
export const SMTP_FROM_EMAIL: string = process.env.SMTP_FROM_EMAIL || '';
export const SMTP_BCC_EMAIL: string = process.env.SMTP_BCC_EMAIL || '';
export const RESOLVE_SERVERS: string = process.env.RESOLVE_SERVERS || '';

// // Socket.io
export const SOCKET_IO_ADAPTER: string = process.env.SOCKET_IO_ADAPTER || ''; // nats://localhost:4222
export const SOCKET_IO_PORT: number = isNumeric(process.env.SOCKET_IO_PORT)
	? Number(process.env.SOCKET_IO_PORT)
	: 3000;

// // Redis
export const REDIS_HOST: string = process.env.REDIS_HOST || '';
export const REDIS_PORT: number = isNumeric(process.env.REDIS_PORT)
	? Number(process.env.REDIS_PORT)
	: 6379;
export const REDIS_USER: string = process.env.REDIS_USER || '';
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || '';
export const REDIS_DB_INDEX: number = isNumeric(process.env.REDIS_DB_INDEX)
	? Number(process.env.REDIS_DB_INDEX)
	: 0;

// // OrientDB
export const ORIENTDB_HOST: string = process.env.ORIENTDB_HOST || '';
export const ORIENTDB_PORT: number = isNumeric(process.env.ORIENTDB_PORT)
	? Number(process.env.ORIENTDB_PORT)
	: 2424;
export const ORIENTDB_ROOT_USER: string = process.env.ORIENTDB_ROOT_USER || 'root';
export const ORIENTDB_ROOT_PASSWORD: string = process.env.ORIENTDB_ROOT_PASSWORD || 'root';
export const ORIENTDB_DB_USER: string = process.env.ORIENTDB_DB_USER || 'admin';
export const ORIENTDB_DB_PASSWORD: string = process.env.ORIENTDB_DB_PASSWORD || 'admin';
export const ORIENTDB_DB_NAME: string = process.env.ORIENTDB_DB_NAME || '';

// // PG
export const POSTGRES_HOST: string = process.env.POSTGRES_HOST || '';
export const POSTGRES_PORT: number = isNumeric(process.env.POSTGRES_PORT)
	? Number(process.env.POSTGRES_PORT)
	: 5432;
export const POSTGRES_USER: string = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD: string =
	process.env.POSTGRES_PASSWORD || 'test';
export const POSTGRES_DB: string = process.env.POSTGRES_DB || 'test';
export const POSTGRES_URI: string = process.env.POSTGRES_URI || '';

// // MongoDB
export const MONGODB_URI: string = process.env.MONGODB_URI || '';

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
