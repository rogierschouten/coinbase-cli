/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

export interface SelectOpts {
	options: string[];
	selectedIndex?: number;
}

export interface InputOpts {
	default?: string;
	maxLength?: number;
	minLength?: number;
}

/**
 * Allows to mock console output for unit tests; also, allows us to put trace logging behind an environment variable
 */
export interface ConsoleOutput {
	/**
	 * Show an error message and a newline
	 */
	error(message?: any, ...optionalParams: any[]): void;
	/**
	 * Show a normal message and a newline
	 */
	log(message?: any, ...optionalParams: any[]): void;
	/**
	 * Show a busy indicator until the given promise resolves
	 */
	busyWhile<T>(p: Promise<T>, message?: any, ...optionalParams: any[]): Promise<T>;
	/**
	 * Have user select from a list of options. Returns item index if selected, returns undefined if cancelled.
	 */
	menu(opts: SelectOpts): Promise<number | undefined>;
	/**
	 * Have user enter a value manually. Returns undefined if cancelled.
	 */
	input(opts: InputOpts): Promise<string | undefined>;
}
