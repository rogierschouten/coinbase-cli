/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 *
 * Abstract interfaces for a promisified coinbase client. Allows to mock server communications.
 */

import * as coinbase from "coinbase";

export {
	AccountType, AccountCurrency, Auth, BuyOpts, BuyStatus, Country, CreateAccountOpts, CreateAddressOpts, Currency, CurrencyType,
	DepositOpts, DepositStatus, ExchangeRate, GetBuyPriceOpts, GetExchangeRateOpts, GetSellPriceOpts, GetSpotPriceOpts, MoneyHash,
	PaymentMethod, PaymentMethodLimit, PaymentMethodLimits, PaymentMethodType, PriceResult, RequestMoneyOpts, Resource, ResourceRef,
	ResourceType, SellOpts, SellStatus, SendMoneyOpts, Time, TransactionStatus, TransactionType, TransferMoneyOpts, UpdateAccountOpts,
	UpdateUserOpts, WithdrawalStatus, WithdrawOpts
} from "coinbase";

/**
 * Promisified coinbase user
 */
export interface User extends coinbase.User {
	showAuth(): Promise<coinbase.Auth>;
	update(opts: coinbase.UpdateUserOpts): Promise<User>;
}

/**
 * Promisified coinbase address
 */
export interface Address extends coinbase.Address {
	getTransactions(opts: {}): Promise<Transaction[]>;
}

/**
 * Promisified coinbase Account
 */
export interface Account extends coinbase.Account {
	setPrimary(): Promise<Account>;
	update(opts: coinbase.UpdateAccountOpts): Promise<Account>;
	delete(): Promise<void>;
	getAddresses(): Promise<Address[]>;
	getAddress(id: string): Promise<Address>;
	createAddress(opts: coinbase.CreateAddressOpts | null): Promise<Address>;
	getTransactions(): Promise<Transaction[]>;
	getTransaction(id: string): Promise<Transaction>;
	sendMoney(opts: coinbase.SendMoneyOpts): Promise<Transaction>;
	transferMoney(opts: coinbase.TransferMoneyOpts): Promise<Transaction>;
	requestMoney(opts: coinbase.RequestMoneyOpts): Promise<Transaction>;
	getBuys(): Promise<Buy[]>;
	getBuy(id: string): Promise<Buy>;
	buy(opts: coinbase.BuyOpts): Promise<Buy>;
	getSells(): Promise<Sell[]>;
	getSell(id: string): Promise<Sell>;
	sell(opts: coinbase.SellOpts): Promise<Sell>;
	getDeposits(): Promise<Deposit[]>;
	getDeposit(id: string): Promise<Deposit>;
	deposit(opts: coinbase.DepositOpts): Promise<Deposit>;
	getWithdrawals(): Promise<Withdrawal[]>;
	getWithdrawal(id: string): Promise<Withdrawal>;
	withdraw(opts: coinbase.WithdrawOpts): Promise<Withdrawal>;
}

/**
 * Promisified coinbase transaction
 */
export interface Transaction extends coinbase.Transaction {
	complete(): Promise<Transaction>;
	resend(): Promise<Transaction>;
	cancel(): Promise<Transaction>;
}

/**
 * Promisified coinbase Buy
 */
export interface Buy extends coinbase.Buy {
	commit(): Promise<Buy>;
}

/**
 * Promisified coinbase Sell
 */
export interface Sell extends coinbase.Sell {
	commit(): Promise<Sell>;
}

/**
 * Promisified coinbase Deposit
 */
export interface Deposit extends coinbase.Deposit {
	commit(): Promise<Deposit>;
}

/**
 * Promisified coinbase Withdrawal
 */
export interface Withdrawal extends coinbase.Withdrawal {
	commit(): Promise<Withdrawal>;
}

/**
 * Promisified coinbase Client
 */
export interface Client {
	getUser(id: string): Promise<User>;
	getCurrentUser(): Promise<User>;
	getAccounts(): Promise<Account[]>;
	getAccount(id: string): Promise<Account>;
	createAccount(opts: coinbase.CreateAccountOpts): Promise<Account>;
	getPaymentMethods(): Promise<coinbase.PaymentMethod[]>;
	getPaymentMethod(id: string): Promise<coinbase.PaymentMethod>;
	getCurrencies(): Promise<coinbase.Currency[]>;
	getExchangeRates(opts: coinbase.GetExchangeRateOpts): Promise<coinbase.ExchangeRate>;
	getSellPrice(opts: coinbase.GetSellPriceOpts): Promise<coinbase.PriceResult>;
	getBuyPrice(opts: coinbase.GetBuyPriceOpts): Promise<coinbase.PriceResult>;
	getSpotPrice(opts: coinbase.GetSpotPriceOpts): Promise<coinbase.PriceResult>;
	getTime(): Promise<coinbase.Time>;
}

export type ClientConstructOpts = coinbase.ClientConstructOpts;
