/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 *
 * Console output implementation
 */

import * as assert from "assert";
import { SingleColumnMenuResponse, terminal } from "terminal-kit";
import * as util from "util";

import { ConsoleOutput, InputOpts, SelectOpts } from "./console-output";
import { defer } from "./promises";

export { ConsoleOutput, InputOpts, SelectOpts } from "./console-output";

/**
 * Default console output
 */
export class ConsoleOutputImpl implements ConsoleOutput {

	/**
	 * Busy indicator state
	 */
	private _busy: boolean = false;
	/**
	 * Busy indicator timer
	 */
	private _busyTimer?: NodeJS.Timer;

	/**
	 * @inheritDoc
	 */
	public error(message?: any, ...optionalParams: any[]): void {
		assert(!this._busy, "you should not write text while displaying a busy indicator");
		terminal.brightRed(ensureLineEnding(util.format(message || "", ...optionalParams)));
	}

	/**
	 * @inheritDoc
	 */
	public log(message?: any, ...optionalParams: any[]): void {
		assert(!this._busy, "you should not write text while displaying a busy indicator");
		terminal.white(ensureLineEnding(util.format(message || "", ...optionalParams)));
	}

	/**
	 * @inheritDoc
	 */
	public async busyWhile<T>(p: Promise<T>, message?: any, ...optionalParams: any[]): Promise<T> {
		let result: T;
		this._busyOn(message, ...optionalParams);
		try {
			result = await p;
		} finally {
			this._busyOff();
		}
		return result;
	}

	/**
	 * @inheritDoc
	 */
	public async menu(opts: SelectOpts): Promise<number | undefined> {
		const result = defer<number | undefined>();
		terminal.singleColumnMenu(
			opts.options,
			{
				oneLineItem: true,
				selectedIndex: Number.isFinite(opts.selectedIndex!) ? opts.selectedIndex : 0
			},
			(error: Error, response: SingleColumnMenuResponse): void => {
				if (error) {
					result.reject(error);
					return;
				}
				result.resolve(response.selectedIndex);
			}
		);
		return result.promise;
	}

	/**
	 * @inheritDoc
	 */
	public async input(opts: InputOpts): Promise<string | undefined> {
		const result = defer<string | undefined>();
		terminal.inputField(
			{
				cancelable: true,
				default: opts.default,
				echo: true,
				maxLength: opts.maxLength,
				minLength: opts.minLength
			},
			(error: Error, response: string): void => {
				if (error) {
					result.reject(error);
					return;
				}
				this.log(); // process ENTER keystroke
				result.resolve(response);
			}
		);
		return result.promise;
	}

	/**
	 * Start showing busy indicator
	 */
	private _busyOn(message?: string, ...optionalParams: any[]): void {
		this._busy = true;
		terminal.gray(util.format(message || "", ...optionalParams));
		let dots = 0;
		this._busyTimer = setInterval((): void => {
			if (dots < 3) {
				terminal.gray(".");
				dots++;
			} else {
				terminal.eraseLine();
				terminal.column(0);
				terminal.gray(message);
				dots = 0;
			}
		}, 250);
	}

	/**
	 * Stop showing busy indicator
	 */
	private _busyOff(): void {
		if (this._busy) {
			this._busy = false;
			if (this._busyTimer) {
				clearInterval(this._busyTimer);
				this._busyTimer = undefined;
			}
			terminal.eraseLine();
			terminal.column(0);
		}
	}
}

/**
 * Ensures s has a newline at the end
 * @param s
 */
function ensureLineEnding(s: string): string {
	if (s.endsWith("\n")) {
		return s;
	} else {
		return s + "\n";
	}
}
