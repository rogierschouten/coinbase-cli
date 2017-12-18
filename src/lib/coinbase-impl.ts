/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 *
 * Promisified coinbase client implementation
 */

import * as coinbase from "coinbase";

import { Account, AccountCurrency, Client, PaymentMethod, PriceResult, SellOpts, Transaction } from "./coinbase";
import { defer } from "./promises";

export { Account, Client, ClientConstructOpts, PaymentMethod, PriceResult, SellOpts, Transaction } from "./coinbase";

/**
 * Promisified coinbase transaction implementation
 */
export class TransactionImpl implements Transaction {
	get resource() { return this._native.resource; }
	get type() { return this._native.type; }
	get status() { return this._native.status; }
	get amount() { return this._native.amount; }
	get native_amount() { return this._native.native_amount; }
	get account() { return this._account; }
	get description() { return this._native.description; }
	get instant_exchange() { return this._native.instant_exchange; }
	get details() { return this._native.details; }
	get network() { return this._native.network; }
	get to() { return this._native.to; }
	get from() { return this._native.from; }
	get address() { return this._native.address; }
	get application() { return this._native.application; }

	private _account: AccountImpl;
	private _native: coinbase.Transaction;

	constructor(account: AccountImpl, native: coinbase.Transaction) {
		this._account = account;
		this._native = native;
	}

	public complete(): Promise<Transaction> {
		const deferred = defer<Transaction>();
		this._native.complete((error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this._account, result));
			}
		});
		return deferred.promise;
	}

	public resend(): Promise<Transaction> {
		const deferred = defer<Transaction>();
		this._native.resend((error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this._account, result));
			}
		});
		return deferred.promise;
	}

	public cancel(): Promise<Transaction> {
		const deferred = defer<Transaction>();
		this._native.cancel((error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this._account, result));
			}
		});
		return deferred.promise;
	}
}

export class SellImpl {
	get resource(): "sell" { return this._native.resource; }
	get status(): coinbase.SellStatus { return this._native.status; }
	get payment_method(): coinbase.ResourceRef | undefined { return this._native.payment_method; }
	get transaction(): coinbase.ResourceRef { return this._native.transaction; }
	get amount(): coinbase.MoneyHash { return this._native.amount; }
	get total(): coinbase.MoneyHash { return this._native.total; }
	get subtotal(): coinbase.MoneyHash { return this._native.subtotal; }
	get fee(): coinbase.MoneyHash { return this._native.fee; }
	get committed(): boolean { return this._native.committed; }
	get instant(): boolean { return this._native.instant; }
	get payout_at(): string | undefined { return this._native.payout_at; }

	private _native: coinbase.Sell;

	constructor(native: coinbase.Sell) {
		this._native = native;
	}

	/**
	 * @inheritDoc
	 */
	public async commit(): Promise<SellImpl> {
		const deferred = defer<SellImpl>();
		this._native.commit((error: Error, result: coinbase.Sell): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new SellImpl(result));
			}
		});
		return deferred.promise;
	}
}

export class AccountImpl implements Account {
	get resource(): "account" { return this._native.resource; }
	get id(): string { return this._native.id; }
	get created_at(): string | undefined { return this._native.created_at; }
	get updated_at(): string | undefined { return this._native.updated_at; }
	get resource_path(): string { return this._native.resource_path; }
	get name(): string { return this._native.name; }
	get primary(): boolean { return this._native.primary; }
	get type(): coinbase.AccountType { return this._native.type; }
	get currency(): AccountCurrency { return this._native.currency; }
	get balance(): coinbase.MoneyHash { return this._native.balance; }

	private _native: coinbase.Account;

	constructor(native: coinbase.Account) {
		this._native = native;
	}

	/**
	 * @inheritDoc
	 */
	public async sell(opts: SellOpts): Promise<SellImpl> {
		const deferred = defer<SellImpl>();
		this._native.sell(opts, (error: Error, result: coinbase.Sell): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new SellImpl(result));
			}
		});
		return deferred.promise;
	}
}

export class ClientImpl implements Client {
	private _native: coinbase.Client;

	constructor(opts: coinbase.ClientConstructOpts) {
		this._native = new coinbase.Client(opts);
	}

	/**
	 * @inheritDoc
	 */
	public async getAccounts(): Promise<Account[]> {
		const deferred = defer<Account[]>();
		this._native.getAccounts({}, (error: Error, result: coinbase.Account[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((account: coinbase.Account): Account => new AccountImpl(account)));
			}
		});
		return deferred.promise;
	}

	/**
	 * @inheritDoc
	 */
	public async getAccount(id: string): Promise<Account> {
		const deferred = defer<Account>();
		this._native.getAccount(id, (error: Error, result: coinbase.Account): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AccountImpl(result));
			}
		});
		return deferred.promise;
	}

	/**
	 * @inheritDoc
	 */
	public async getPaymentMethods(): Promise<PaymentMethod[]> {
		const deferred = defer<PaymentMethod[]>();
		this._native.getPaymentMethods({}, (error: Error, result: PaymentMethod[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	/**
	 * @inheritDoc
	 */
	public async getPaymentMethod(id: string): Promise<PaymentMethod> {
		const deferred = defer<PaymentMethod>();
		this._native.getPaymentMethod(id, (error: Error, result: PaymentMethod): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	/**
	 * @inheritDoc
	 */
	public async getSellPrice(opts: coinbase.GetSellPriceOpts): Promise<PriceResult> {
		const deferred = defer<PriceResult>();
		this._native.getSellPrice(opts, (error: Error, result: PriceResult): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}
}
