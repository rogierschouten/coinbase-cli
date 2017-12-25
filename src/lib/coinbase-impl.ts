/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 *
 * Promisified coinbase client implementation
 */

import * as coinbase from "coinbase";

import {
	Account, AccountCurrency, Address, Auth, Buy, Client, Deposit, PaymentMethod, PriceResult, Sell, Transaction, User, Withdrawal
} from "./coinbase";
import { defer } from "./promises";

export {
	AccountType, AccountCurrency, Auth, BuyOpts, BuyStatus, Country, CreateAccountOpts, CreateAddressOpts, Currency, CurrencyType,
	DepositOpts, DepositStatus, ExchangeRate, GetBuyPriceOpts, GetExchangeRateOpts, GetSellPriceOpts, GetSpotPriceOpts, MoneyHash,
	PaymentMethod, PaymentMethodLimit, PaymentMethodLimits, PaymentMethodType, PriceResult, RequestMoneyOpts, Resource, ResourceRef,
	ResourceType, SellOpts, SellStatus, SendMoneyOpts, Time, TransactionStatus, TransactionType, TransferMoneyOpts, UpdateAccountOpts,
	UpdateUserOpts, WithdrawalStatus, WithdrawOpts
} from "./coinbase";

/**
 * Promisified coinbase user
 */
export class UserImpl implements User {
	get resource() { return this._native.resource; }
	get id() { return this._native.id; }
	get created_at() { return this._native.created_at; }
	get updated_at() { return this._native.updated_at; }
	get resource_path() { return this._native.resource_path; }
	get name() { return this._native.name; }
	get username() { return this._native.username; }
	get profile_location() { return this._native.profile_location; }
	get profile_bio() { return this._native.profile_bio; }
	get profile_url() { return this._native.profile_url; }
	get avatar_url() { return this._native.avatar_url; }
	get time_zone() { return this._native.time_zone; }
	get native_currency() { return this._native.native_currency; }
	get bitcoin_unit() { return this._native.bitcoin_unit; }
	get country() { return this._native.country; }
	get email() { return this._native.email; }

	private _native: coinbase.User;

	constructor(native: coinbase.User) {
		this._native = native;
	}

	public async showAuth(): Promise<Auth> {
		const deferred = defer<Auth>();
		this._native.showAuth((error: Error, result: coinbase.Auth): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	public async update(opts: coinbase.UpdateUserOpts): Promise<UserImpl> {
		const deferred = defer<UserImpl>();
		this._native.update(opts, (error: Error, result: coinbase.User): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new UserImpl(result));
			}
		});
		return deferred.promise;
	}
}

export class AddressImpl implements Address {
	get resource() { return this._native.resource; }
	get address() { return this._native.address; }
	get name() { return this._native.name; }

	private _account: AccountImpl;
	private _native: coinbase.Address;

	constructor(account: AccountImpl, native: coinbase.Address) {
		this._account = account;
		this._native = native;
	}

	public async getTransactions(opts: {}): Promise<TransactionImpl[]> {
		const deferred = defer<TransactionImpl[]>();
		this._native.getTransactions(opts, (error: Error, result: coinbase.Transaction[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((t: coinbase.Transaction) => new TransactionImpl(this._account, t)));
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

	public async setPrimary(): Promise<AccountImpl> {
		const deferred = defer<AccountImpl>();
		this._native.setPrimary((error: Error, result: coinbase.Account): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AccountImpl(result));
			}
		});
		return deferred.promise;
	}

	public async update(opts: coinbase.UpdateAccountOpts): Promise<AccountImpl> {
		const deferred = defer<AccountImpl>();
		this._native.update(opts, (error: Error, result: coinbase.Account): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AccountImpl(result));
			}
		});
		return deferred.promise;
	}

	public async delete(): Promise<void> {
		const deferred = defer();
		this._native.delete((error: Error): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	}

	public async getAddresses(): Promise<AddressImpl[]> {
		const deferred = defer<AddressImpl[]>();
		this._native.getAddresses((error: Error, result: coinbase.Address[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((a) => new AddressImpl(this, a)));
			}
		});
		return deferred.promise;
	}

	public async getAddress(id: string): Promise<AddressImpl> {
		const deferred = defer<AddressImpl>();
		this._native.getAddress(id, (error: Error, result: coinbase.Address): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AddressImpl(this, result));
			}
		});
		return deferred.promise;
	}

	public async createAddress(opts: coinbase.CreateAddressOpts | null): Promise<AddressImpl> {
		const deferred = defer<AddressImpl>();
		this._native.createAddress(opts, (error: Error, result: coinbase.Address): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AddressImpl(this, result));
			}
		});
		return deferred.promise;
	}

	public async getTransactions(): Promise<TransactionImpl[]> {
		const deferred = defer<TransactionImpl[]>();
		this._native.getTransactions((error: Error, result: coinbase.Transaction[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((t) => new TransactionImpl(this, t)));
			}
		});
		return deferred.promise;
	}

	public async getTransaction(id: string): Promise<TransactionImpl> {
		const deferred = defer<TransactionImpl>();
		this._native.getTransaction(id, (error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this, result));
			}
		});
		return deferred.promise;
	}

	public async sendMoney(opts: coinbase.SendMoneyOpts): Promise<TransactionImpl> {
		const deferred = defer<TransactionImpl>();
		this._native.sendMoney(opts, (error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this, result));
			}
		});
		return deferred.promise;
	}

	public async transferMoney(opts: coinbase.TransferMoneyOpts): Promise<Transaction> {
		const deferred = defer<TransactionImpl>();
		this._native.transferMoney(opts, (error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this, result));
			}
		});
		return deferred.promise;
	}

	public async requestMoney(opts: coinbase.RequestMoneyOpts): Promise<Transaction> {
		const deferred = defer<TransactionImpl>();
		this._native.requestMoney(opts, (error: Error, result: coinbase.Transaction): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new TransactionImpl(this, result));
			}
		});
		return deferred.promise;
	}

	public async getBuys(): Promise<BuyImpl[]> {
		const deferred = defer<BuyImpl[]>();
		this._native.getBuys((error: Error, result: coinbase.Buy[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((b) => new BuyImpl(b)));
			}
		});
		return deferred.promise;
	}

	public async getBuy(id: string): Promise<BuyImpl> {
		const deferred = defer<BuyImpl>();
		this._native.getBuy(id, (error: Error, result: coinbase.Buy): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new BuyImpl(result));
			}
		});
		return deferred.promise;
	}

	public async buy(opts: coinbase.BuyOpts): Promise<BuyImpl> {
		const deferred = defer<BuyImpl>();
		this._native.buy(opts, (error: Error, result: coinbase.Buy): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new BuyImpl(result));
			}
		});
		return deferred.promise;
	}

	public async getSells(): Promise<SellImpl[]> {
		const deferred = defer<SellImpl[]>();
		this._native.getSells((error: Error, result: coinbase.Sell[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((s) => new SellImpl(s)));
			}
		});
		return deferred.promise;
	}

	public async getSell(id: string): Promise<SellImpl> {
		const deferred = defer<SellImpl>();
		this._native.getSell(id, (error: Error, result: coinbase.Sell): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new SellImpl(result));
			}
		});
		return deferred.promise;
	}

	public async sell(opts: coinbase.SellOpts): Promise<SellImpl> {
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

	public async getDeposits(): Promise<DepositImpl[]> {
		const deferred = defer<DepositImpl[]>();
		this._native.getDeposits((error: Error, result: coinbase.Deposit[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((d) => new DepositImpl(d)));
			}
		});
		return deferred.promise;
	}

	public async getDeposit(id: string): Promise<DepositImpl> {
		const deferred = defer<DepositImpl>();
		this._native.getDeposit(id, (error: Error, result: coinbase.Deposit): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new DepositImpl(result));
			}
		});
		return deferred.promise;
	}

	public async deposit(opts: coinbase.DepositOpts): Promise<DepositImpl> {
		const deferred = defer<DepositImpl>();
		this._native.deposit(opts, (error: Error, result: coinbase.Deposit): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new DepositImpl(result));
			}
		});
		return deferred.promise;
	}

	public async getWithdrawals(): Promise<WithdrawalImpl[]> {
		const deferred = defer<WithdrawalImpl[]>();
		this._native.getWithdrawals((error: Error, result: coinbase.Withdrawal[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((d) => new WithdrawalImpl(d)));
			}
		});
		return deferred.promise;
	}

	public async getWithdrawal(id: string): Promise<WithdrawalImpl> {
		const deferred = defer<WithdrawalImpl>();
		this._native.getWithdrawal(id, (error: Error, result: coinbase.Withdrawal): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new WithdrawalImpl(result));
			}
		});
		return deferred.promise;
	}

	public async withdraw(opts: coinbase.WithdrawOpts): Promise<WithdrawalImpl> {
		const deferred = defer<WithdrawalImpl>();
		this._native.withdraw(opts, (error: Error, result: coinbase.Withdrawal): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new WithdrawalImpl(result));
			}
		});
		return deferred.promise;
	}
}

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

export class BuyImpl implements Buy {
	get resource(): "buy" { return this._native.resource; }
	get status(): coinbase.BuyStatus { return this._native.status; }
	get payment_method(): coinbase.ResourceRef | undefined { return this._native.payment_method; }
	get transaction(): coinbase.ResourceRef { return this._native.transaction; }
	get amount(): coinbase.MoneyHash { return this._native.amount; }
	get total(): coinbase.MoneyHash { return this._native.total; }
	get subtotal(): coinbase.MoneyHash { return this._native.subtotal; }
	get fee(): coinbase.MoneyHash { return this._native.fee; }
	get committed(): boolean { return this._native.committed; }
	get instant(): boolean { return this._native.instant; }
	get payout_at(): string | undefined { return this._native.payout_at; }

	private _native: coinbase.Buy;

	constructor(native: coinbase.Buy) {
		this._native = native;
	}

	/**
	 * @inheritDoc
	 */
	public async commit(): Promise<BuyImpl> {
		const deferred = defer<BuyImpl>();
		this._native.commit((error: Error, result: coinbase.Buy): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new BuyImpl(result));
			}
		});
		return deferred.promise;
	}
}

export class SellImpl implements Sell {
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

export class DepositImpl implements Deposit {
	get resource() { return this._native.resource; }
	get id() { return this._native.id; }
	get created_at() { return this._native.created_at; }
	get updated_at() { return this._native.updated_at; }
	get resource_path() { return this._native.resource_path; }
	get status() { return this._native.status; }
	get payment_method() { return this._native.payment_method; }
	get transaction() { return this._native.transaction; }
	get amount() { return this._native.amount; }
	get subtotal() { return this._native.subtotal; }
	get fee() { return this._native.fee; }
	get committed() { return this._native.committed; }
	get payout_at() { return this._native.payout_at; }

	private _native: coinbase.Deposit;

	constructor(native: coinbase.Deposit) {
		this._native = native;
	}

	/**
	 * @inheritDoc
	 */
	public async commit(): Promise<DepositImpl> {
		const deferred = defer<DepositImpl>();
		this._native.commit((error: Error, result: coinbase.Deposit): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new DepositImpl(result));
			}
		});
		return deferred.promise;
	}
}

export class WithdrawalImpl implements Withdrawal {
	get resource() { return this._native.resource; }
	get id() { return this._native.id; }
	get created_at() { return this._native.created_at; }
	get updated_at() { return this._native.updated_at; }
	get resource_path() { return this._native.resource_path; }
	get status() { return this._native.status; }
	get payment_method() { return this._native.payment_method; }
	get transaction() { return this._native.transaction; }
	get amount() { return this._native.amount; }
	get subtotal() { return this._native.subtotal; }
	get fee() { return this._native.fee; }
	get committed() { return this._native.committed; }
	get payout_at() { return this._native.payout_at; }

	private _native: coinbase.Withdrawal;

	constructor(native: coinbase.Withdrawal) {
		this._native = native;
	}

	/**
	 * @inheritDoc
	 */
	public async commit(): Promise<WithdrawalImpl> {
		const deferred = defer<WithdrawalImpl>();
		this._native.commit((error: Error, result: coinbase.Withdrawal): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new WithdrawalImpl(result));
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

	public async getUser(id: string): Promise<UserImpl> {
		const deferred = defer<UserImpl>();
		this._native.getUser(id, (error: Error, result: coinbase.User): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new UserImpl(result));
			}
		});
		return deferred.promise;
	}

	public async getCurrentUser(): Promise<UserImpl> {
		const deferred = defer<UserImpl>();
		this._native.getCurrentUser((error: Error, result: coinbase.User): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new UserImpl(result));
			}
		});
		return deferred.promise;
	}

	public async getAccounts(): Promise<AccountImpl[]> {
		const deferred = defer<AccountImpl[]>();
		this._native.getAccounts({}, (error: Error, result: coinbase.Account[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result.map((account: coinbase.Account): AccountImpl => new AccountImpl(account)));
			}
		});
		return deferred.promise;
	}

	public async getAccount(id: string): Promise<AccountImpl> {
		const deferred = defer<AccountImpl>();
		this._native.getAccount(id, (error: Error, result: coinbase.Account): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AccountImpl(result));
			}
		});
		return deferred.promise;
	}

	public async createAccount(opts: coinbase.CreateAccountOpts): Promise<AccountImpl> {
		const deferred = defer<AccountImpl>();
		this._native.createAccount(opts, (error: Error, result: coinbase.Account): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(new AccountImpl(result));
			}
		});
		return deferred.promise;
	}

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

	public async getCurrencies(): Promise<coinbase.Currency[]> {
		const deferred = defer<coinbase.Currency[]>();
		this._native.getCurrencies((error: Error, result: coinbase.Currency[]): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	public async getExchangeRates(opts: coinbase.GetExchangeRateOpts): Promise<coinbase.ExchangeRate> {
		const deferred = defer<coinbase.ExchangeRate>();
		this._native.getExchangeRates(opts, (error: Error, result: coinbase.ExchangeRate): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

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

	public async getBuyPrice(opts: coinbase.GetBuyPriceOpts): Promise<PriceResult> {
		const deferred = defer<PriceResult>();
		this._native.getBuyPrice(opts, (error: Error, result: PriceResult): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	public async getSpotPrice(opts: coinbase.GetSpotPriceOpts): Promise<coinbase.PriceResult> {
		const deferred = defer<PriceResult>();
		this._native.getSpotPrice(opts, (error: Error, result: PriceResult): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

	public async getTime(): Promise<coinbase.Time> {
		const deferred = defer<coinbase.Time>();
		this._native.getTime((error: Error, result: coinbase.Time): void => {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(result);
			}
		});
		return deferred.promise;
	}

}
