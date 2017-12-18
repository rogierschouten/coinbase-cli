/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import * as Bluebird from "bluebird";
import * as sinon from "sinon";
export { SinonFakeTimers } from "sinon";

let promise: any;

export function fakeTime(): sinon.SinonFakeTimers {
	const clock = sinon.useFakeTimers(0);
	promise = global.Promise;
	global.Promise = Bluebird;
	Bluebird.setScheduler((cb: () => void) => setTimeout(cb, 0));
	return clock;
}

export function restoreTime(clock: sinon.SinonFakeTimers): void {
	clock.tick(100);
	clock.restore();
	global.Promise = promise;
}

export function runPromise<T>(clock: sinon.SinonFakeTimers, p: PromiseLike<T>): T {
	let result: T | undefined;
	let error: Error | undefined;
	let done = false;
	p.then(
		(r: T) => {
			result = r;
			done = true;
		},
		(e: Error) => {
			error = e;
			done = true;
		}
	);
	while (!done) {
		clock.tick(10);
	}
	if (error) {
		throw error;
	}
	return result!;
}
