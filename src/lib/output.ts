
/**
 * Allows to mock console output for unit tests; also, allows us to put trace logging behind an environment variable
 */
export interface ConsoleOutput {
	error(message?: any, ...optionalParams: any[]): void;
	log(message?: any, ...optionalParams: any[]): void;
	trace(message?: any, ...optionalParams: any[]): void;
}

/**
 * Default console output
 */
export const output: ConsoleOutput = {
	error(message?: any, ...optionalParams: any[]): void {
		// tslint:disable-next-line:no-console
		console.error(message, ...optionalParams);
	},
	log(message?: any, ...optionalParams: any[]): void {
		// tslint:disable-next-line:no-console
		console.log(message, ...optionalParams);
	},
	trace(message?: any, ...optionalParams: any[]): void {
		if (process.env.COINBASE_TRACE) {
			// tslint:disable-next-line:no-console
			console.trace(message, ...optionalParams);
		}
	}
};
