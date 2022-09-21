export const DEBUG: boolean =
	!!process.env.ENV && process.env.ENV.indexOf('dev') > -1;

export const VERSION: string = process.env.VERSION || 'v0';
