/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import * as assert from "assert";
import * as util from "util";

import { ConsoleOutput, InputOpts, SelectOpts } from "../lib/console-output";
import { defer, Deferred } from "../lib/promises";

export { ConsoleOutput, InputOpts, SelectOpts } from "../lib/console-output";

export interface MenuCall {
	opts: SelectOpts;
	deferred: Deferred<number | undefined>;
}

export interface InputCall {
	opts: InputOpts;
	deferred: Deferred<string | undefined>;
}

/**
 * Mock console output for testing purposes
 */
export class ConsoleOutputMock implements ConsoleOutput {

	/**
	 * Test interface, indicates that a busy indicator is currently shown
	 */
	public busy: boolean;
	/**
	 * Test interface - errors that were output
	 */
	public errors: string[] = [];
	/**
	 * Test interface - log messages that were output
	 */
	public logs: string[] = [];
	/**
	 * Test interfaces - select menu calls
	 */
	public menus: MenuCall[] = [];
	/**
	 * Test interface - input calls
	 */
	public inputs: InputCall[] = [];

	/**
	 * Test interface, simulate choosing from a menu
	 * @param n
	 */
	public resolveMenu(n: number | undefined): void {
		assert(this.menus.length > 0, "no menu asked for");
		this.menus[this.menus.length - 1].deferred.resolve(n);
	}

	/**
	 * Test interface, simulate giving input
	 * @param s
	 */
	public resolveInput(s: string | undefined): void {
		assert(this.inputs.length > 0, "no menu asked for");
		this.inputs[this.inputs.length - 1].deferred.resolve(s);
	}

	/**
	 * @inheritDoc
	 */
	public error(message?: any, ...optionalParams: any[]): void {
		assert(!this.busy, "you should not write text while displaying a busy indicator");
		this.errors.push(util.format(message, ...optionalParams));
	}

	/**
	 * @inheritDoc
	 */
	public log(message?: any, ...optionalParams: any[]): void {
		assert(!this.busy, "you should not write text while displaying a busy indicator");
		this.logs.push(util.format(message, ...optionalParams));
	}

	/**
	 * @inheritDoc
	 */
	public async busyWhile<T>(p: Promise<T>, _message?: any, ..._optionalParams: any[]): Promise<T> {
		this.busy = true;
		try {
			const result = await p;
			return result;
		} finally {
			this.busy = false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public async menu(opts: SelectOpts): Promise<number | undefined> {
		const deferred = defer<number | undefined>();
		this.menus.push({
			deferred,
			opts
		});
		return deferred.promise;
	}

	/**
	 * @inheritDoc
	 */
	public async input(opts: InputOpts): Promise<string | undefined> {
		const deferred = defer<string | undefined>();
		this.inputs.push({
			deferred,
			opts
		});
		return deferred.promise;
	}
}
