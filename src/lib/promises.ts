
export interface VoidDeferred {
	resolve: () => void;
	reject: (error: Error) => void;
	promise: Promise<void>;
}

export interface Deferred<T> {
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (error: Error) => void;
	promise: Promise<T>;
}

/**
 * Creates a deferred promise
 */
export function defer(): VoidDeferred;
export function defer<T>(): Deferred<T>;
export function defer<T>(): Deferred<T> {
	let resolve: (value: T | PromiseLike<T>) => void;
	let reject: (error: Error) => void;
	const promise = new Promise<T>((res: (value: T | PromiseLike<T>) => void, rej: (error: Error) => void): void => {
		resolve = res;
		reject = rej;
	});
	return {
		promise,
		reject: reject!,
		resolve: resolve!
	};
}
