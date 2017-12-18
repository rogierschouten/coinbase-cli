/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 *
 * Mock coinbase API for dry-running and unit testing
 */

import {
	Account, AccountCurrency, AccountType, Address, Client, GetSellPriceOpts, MoneyHash, PaymentMethod, PriceResult, ResourceRef, Sell,
	SellOpts, SellStatus, Transaction, TransactionStatus, TransactionType
} from "./coinbase";

/**
 * Promisified coinbase transaction implementation
 */
export class TransactionMock implements Transaction {
	public resource: "transaction" = "transaction";
	public type: TransactionType;
	public status: TransactionStatus;
	public amount: MoneyHash;
	public native_amount: MoneyHash;
	public account: AccountMock;
	public description: string;
	public instant_exchange: boolean;
	public details: any;
	public network?: any;
	public to?: ResourceRef | string;
	public from?: ResourceRef | string;
	public address?: Address;
	public application?: any;

	constructor(account: AccountMock) {
		this.account = account;
	}

	/**
	 * @inheritDoc
	 */
	public complete(): Promise<TransactionMock> {
		this.status = "completed";
		return Promise.resolve(this);
	}

	/**
	 * @inheritDoc
	 */
	public resend(): Promise<Transaction> {
		this.status = "completed";
		return Promise.resolve(this);
	}

	/**
	 * @inheritDoc
	 */
	public cancel(): Promise<Transaction> {
		this.status = "canceled";
		return Promise.resolve(this);
	}
}

export class SellMock implements Sell {
	public resource: "sell" = "sell";
	public status: SellStatus;
	public payment_method?: ResourceRef;
	public transaction: ResourceRef;
	public amount: MoneyHash;
	public total: MoneyHash;
	public subtotal: MoneyHash;
	public fee: MoneyHash;
	public committed: boolean;
	public instant: boolean;
	public payout_at: string | undefined;

	constructor(opts: {
		status: SellStatus,
		payment_method?: ResourceRef,
		transaction: ResourceRef,
		amount: MoneyHash,
		total: MoneyHash,
		subtotal: MoneyHash,
		fee: MoneyHash,
		committed: boolean,
		instant: boolean,
		payout_at: string | undefined
	}) {
		this.status = opts.status;
		this.payment_method = opts.payment_method;
		this.transaction = opts.transaction;
		this.amount = opts.amount;
		this.total = opts.total;
		this.subtotal = opts.subtotal;
		this.fee = opts.fee;
		this.committed = opts.committed;
		this.instant = opts.instant;
		this.payout_at = opts.payout_at;
	}

	/**
	 * @inheritDoc
	 */
	public async commit(): Promise<SellMock> {
		if (this.status !== "created") {
			throw new Error(`you cannot commit a ${this.status} order`);
		}
		const result = new SellMock({
			amount: this.amount,
			committed: true,
			fee: this.fee,
			instant: false,
			payment_method: this.payment_method,
			payout_at: this.payout_at,
			status: "completed",
			subtotal: this.subtotal,
			total: this.total,
			transaction: this.transaction
		});
		return result;
	}
}

export class AccountMock implements Account {
	public resource: "account" = "account";
	public id: string;
	public created_at: string | undefined;
	public updated_at: string | undefined;
	public resource_path: string;
	public name: string;
	public primary: boolean;
	public type: AccountType;
	public currency: AccountCurrency;
	public balance: MoneyHash;

	constructor(opts: {
		id: string;
		created_at: string | undefined;
		updated_at: string | undefined;
		resource_path: string;
		name: string;
		primary: boolean;
		type: AccountType;
		currency: AccountCurrency;
		balance: MoneyHash
	}) {
		this.id = opts.id;
		this.created_at = opts.created_at;
		this.updated_at = opts.updated_at;
		this.resource_path = opts.resource_path;
		this.name = opts.name;
		this.primary = opts.primary;
		this.type = opts.type;
		this.currency = opts.currency;
		this.balance = opts.balance;
	}

	public async sell(opts: SellOpts): Promise<SellMock> {
		let amt: string;
		let total: string;
		let fee: string;
		let subtotal: string;
		if (opts.amount) {
			amt = opts.amount;
			total = (parseFloat(opts.amount) * 1.1).toString(10);
			subtotal = opts.amount;
			fee = (parseFloat(opts.amount) * 0.1).toString(10);
		} else if (opts.total) {
			amt = (parseFloat(opts.total) * 0.9).toString(10);
			total = opts.total;
			subtotal = amt;
			fee = (parseFloat(opts.total) * 0.1).toString(10);
		} else {
			throw new Error("amount nor total given");
		}
		const result = new SellMock({
			amount: { amount: amt, currency: opts.currency },
			committed: false,
			fee: { amount: fee, currency: opts.currency },
			instant: false,
			payment_method: opts.payment_method ?
				{ id: opts.payment_method!, resource: "payment_method", resource_path: `/payment_method/${opts.payment_method}` } :
				undefined,
			payout_at: "2017-12-15T23:50:24",
			status: opts.quote ? "completed" : "created",
			subtotal: { amount: subtotal, currency: opts.currency },
			total: { amount: total, currency: opts.currency },
			transaction: { id: "8975487954q389753q4897354", resource: "transaction", resource_path: "/transactions/8975487954q389753q4897354" }
		});
		return result;
	}
}

export class ClientMock implements Client {

	/**
	 * test interface: set mock accounts
	 */
	public _accounts: AccountMock[] = exampleAccounts();

	/**
	 * test interface: set payment methods
	 */
	public _paymentMethods: PaymentMethod[] = examplePaymentMethods();

	/**
	 * @inheritDoc
	 */
	public async getAccounts(): Promise<Account[]> {
		return this._accounts;
	}

	/**
	 * @inheritDoc
	 */
	public async getAccount(id: string): Promise<Account> {
		for (const account of this._accounts) {
			if (account.id === id) {
				return account;
			}
		}
		throw new Error("Not found"); // this is the error Coinbase API sends back
	}

	/**
	 * @inheritDoc
	 */
	public async getPaymentMethods(): Promise<PaymentMethod[]> {
		return this._paymentMethods;
	}

	/**
	 * @inheritDoc
	 */
	public async getPaymentMethod(id: string): Promise<PaymentMethod> {
		for (const paymentMethod of this._paymentMethods) {
			if (paymentMethod.id === id) {
				return paymentMethod;
			}
		}
		throw new Error("Not found"); // this is the error Coinbase API sends back
	}

	/**
	 * @inheritDoc
	 */
	public async getSellPrice(opts: GetSellPriceOpts): Promise<PriceResult> {
		if (opts.currencyPair.indexOf("-") === -1) {
			throw new Error("invalid currency pair");
		}
		return { data: { base: opts.currencyPair.split("-")[0], amount: "15234.23", currency: opts.currencyPair.split("-")[1] } };
	}
}

// tslint:disable:object-literal-sort-keys
/**
 * Returns a set of example mock accounts
 */
export function exampleAccounts(): AccountMock[] {
	return [
		new AccountMock({
			id: "db7abb63-2e8b-534a-bdff-5d1dbf2234f2",
			name: "EUR Wallet",
			primary: false,
			type: "fiat",
			currency:
				{
					code: "EUR",
					name: "Euro",
					color: "#0066cf",
					exponent: 2,
					type: "fiat"
				},
			balance: { amount: "172.83", currency: "EUR" },
			created_at: "2017-07-21T07:59:50Z",
			updated_at: "2017-12-12T23:15:27Z",
			resource_path: "/v2/accounts/db7abb63-2e8b-534a-bdff-5d1dbf2234f2"
		}),
		new AccountMock({
			id: "a3b02e94-73f8-557a-a553-4e0ad5abbbb3a2",
			name: "LTC Wallet",
			primary: false,
			type: "wallet",
			currency:
				{
					code: "LTC",
					name: "Litecoin",
					color: "#B5B5B5",
					exponent: 8,
					type: "crypto",
					address_regex: "L|M|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$"
				},
			balance: { amount: "0.94940530", currency: "LTC" },
			created_at: "2017-07-21T07:58:50Z",
			updated_at: "2017-12-12T22:15:37Z",
			resource_path: "/v2/accounts/a3b02e94-73f8-557a-a553-4e0ad5abbbb3a2"
		}),
		new AccountMock({
			id: "ea81d255-a43d-53f7-8379-08a2f96d0034",
			name: "ETH Wallet",
			primary: false,
			type: "wallet",
			currency:
				{
					code: "ETH",
					name: "Ethereum",
					color: "#6F7CBA",
					exponent: 8,
					type: "crypto",
					address_regex: "?:0x)?[0-9a-fA-F]{40}$"
				},
			balance: { amount: "0.00000000", currency: "ETH" },
			created_at: "2017-07-21T07:58:50Z",
			updated_at: "2017-07-21T07:58:50Z",
			resource_path: "/v2/accounts/ea81d255-a43d-53f7-8379-08a2f96d0034"
		}),
		new AccountMock({
			id: "33452906-0ab7-596a-98bd-cb3b62806ebe",
			name: "BTC Wallet",
			primary: true,
			type: "wallet",
			currency:
				{
					code: "BTC",
					name: "Bitcoin",
					color: "#FFB119",
					exponent: 8,
					type: "crypto",
					address_regex: "13][a-km-zA-HJ-NP-Z1-9]{25,34}$"
				},
			balance: { amount: "0.00000000", currency: "BTC" },
			created_at: "2017-07-21T07:58:50Z",
			updated_at: "2017-12-12T23:14:55Z",
			resource_path: "/v2/accounts/33452906-0eb7-596a-98bd-cb3b62806ebe"
		})
	];
}

function examplePaymentMethods(): PaymentMethod[] {
	return [{
		id: "b378cf67-a6bd-5f84-bcb4-5c29682d186d",
		type: "sepa_bank_account",
		name: "ABN AMRO (NL84 ABNA 0463 4913 35)",
		currency: "EUR",
		primary_buy: false,
		primary_sell: false,
		allow_buy: false,
		allow_sell: false,
		allow_deposit: false,
		allow_withdraw: true,
		instant_buy: false,
		instant_sell: false,
		created_at: "2017-11-26T16:01:45Z",
		updated_at: "2017-11-27T10:09:32Z",
		resource: "payment_method",
		resource_path: "/v2/payment-methods/b378cf67-a6bd-5f84-bcb4-5c29682d186d",
		verified: true
	}, {
		id: "453ebbdf-9d09-578f-8fec-ecfd7e7fed17",
		type: "fiat_account",
		name: "EUR Wallet",
		currency: "EUR",
		primary_buy: true,
		primary_sell: true,
		allow_buy: true,
		allow_sell: true,
		allow_deposit: true,
		allow_withdraw: true,
		instant_buy: true,
		instant_sell: true,
		created_at: "2017-07-21T07:59:50Z",
		updated_at: "2017-07-21T07:59:50Z",
		resource: "payment_method",
		resource_path: "/v2/payment-methods/453ebbdf-9d09-578f-8fec-ecfd7e7fed17",
		fiat_account:
			{
				id: "db7abb63-2e8b-534a-bdff-5d1dbf2486b0",
				resource: "account",
				resource_path: "/v2/accounts/db7abb63-2e8b-534a-bdff-5d1dbf2486b0"
			},
		verified: true
	}];
}
// tslint:enable:object-literal-sort-keys