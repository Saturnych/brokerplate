export const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

export const DEBUG: boolean =
	!!process.env.ENV && process.env.ENV.indexOf('dev') > -1;

export const VERSION: string = process.env.VERSION || 'v0';

// // Redis
export const REDIS_HOST = process.env.REDIS_HOST || '';
export const REDIS_PORT = process.env.REDIS_PORT && isNumeric(process.env.REDIS_PORT) ? Number(process.env.REDIS_PORT) : 6379; // 11888
export const REDIS_USER = process.env.REDIS_USER || '';
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
export const REDIS_DB_INDEX = process.env.REDIS_DB_INDEX && isNumeric(process.env.REDIS_DB_INDEX) ? Number(process.env.REDIS_DB_INDEX) : 0;
