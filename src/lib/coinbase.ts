/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 *
 * Abstract interfaces for a promisified coinbase client. Allows to mock server communications.
 */

import * as coinbase from "coinbase";

export {
	AccountType, AccountCurrency, Address, GetSellPriceOpts, SellStatus, MoneyHash, PaymentMethod, PriceResult, ResourceRef, SellOpts,
	TransactionStatus, TransactionType
} from "coinbase";

/**
 * Promisified coinbase transaction
 */
export interface Transaction {
	/**
	 * Constant "transaction"
	 */
	resource: "transaction";

	/**
	 * Transaction type
	 */
	type: coinbase.TransactionType;

	/**
	 * Transaction status
	 */
	status: coinbase.TransactionStatus;

	/**
	 * Amount in bitcoin, litecoin or ethereum
	 */
	amount: coinbase.MoneyHash;

	/**
	 * Amount in user's native currency
	 */
	native_amount: coinbase.MoneyHash;

	/**
	 * Account associated with the transaction
	 */
	account: Account;

	/**
	 * User defined description
	 */
	description: string;

	/**
	 * Indicator if the transaction was instant exchanged (received into a bitcoin address for a fiat account)
	 */
	instant_exchange: boolean;

	/**
	 * Detailed information about the transaction
	 */
	details: any;

	/**
	 * Information about bitcoin, litecoin or ethereum network including network transaction hash if transaction was on-blockchain.
	 * Only available for certain types of transactions
	 */
	network?: any;

	/**
	 * The receiving party of a debit transaction. Usually another resource but can also be another type like email.
	 * Only available for certain types of transactions
	 */
	to?: coinbase.ResourceRef | string;

	/**
	 * The originating party of a credit transaction. Usually another resource but can also be another type like bitcoin network.
	 * Only available for certain types of transactions
	 */
	from?: coinbase.ResourceRef | string;

	/**
	 * Associated bitcoin, litecoin or ethereum address for received payment
	 */
	address?: coinbase.Address;

	/**
	 * Associated OAuth2 application
	 */
	application?: any;

	/**
	 * Lets the recipient of a money request complete the request by sending money to the user who requested the money.
	 * This can only be completed by the user to whom the request was made, not the user who sent the request.
	 * Scope: wallet:transactions:request
	 */
	complete(): Promise<Transaction>;

	/**
	 * Lets the user resend a money request. This will notify recipient with a new email.
	 * Scope: wallet:transactions:request
	 */
	resend(): Promise<Transaction>;
	/**
	 * Lets a user cancel a money request. Money requests can be canceled by the sender or the recipient.
	 * Scope: wallet:transactions:request
	 */
	cancel(): Promise<Transaction>;
}

/**
 * Sell resource
 */
export interface Sell {
	/**
	 * Constant "sell"
	 */
	resource: "sell";

	/**
	 * Status of the sell. Currently available values: created, completed, canceled
	 */
	status: coinbase.SellStatus;

	/**
	 * Associated payment method (e.g. a bank, fiat account)
	 */
	payment_method?: coinbase.ResourceRef;

	/**
	 * Associated transaction (e.g. a bank, fiat account)
	 */
	transaction: coinbase.ResourceRef;

	/**
	 * Amount in bitcoin, litecoin or ethereum
	 */
	amount: coinbase.MoneyHash;

	/**
	 * Fiat amount with fees
	 */
	total: coinbase.MoneyHash;

	/**
	 * Fiat amount without fees
	 */
	subtotal: coinbase.MoneyHash;

	/**
	 * Fee associated to this sell
	 */
	fee: coinbase.MoneyHash;

	/**
	 * Has this sell been committed?
	 */
	committed: boolean;

	/**
	 * Was this sell executed instantly?
	 */
	instant: boolean;

	/**
	 * When a sell isn’t executed instantly, it will receive a payout date for the time it will be executed. ISO timestamp
	 */
	payout_at?: string;

	/**
	 * Completes a sell that is created in commit: false state.
	 * If the exchange rate has changed since the sell was created, this call will fail with the error “The exchange rate updated while you
	 * were waiting. The new total is shown below”. The buy’s total will also be updated. You can repeat the `commit` call to accept the new
	 * values and start the buy at the new rates.
	 * Scope: wallet:sells:create
	 */
	commit(): Promise<Sell>;
}

/**
 * Promisified coinbase Account
 */
export interface Account {
	/**
	 * Type of resource, constant string "account"
	 */
	resource: "account";

	/**
	 * Resource ID
	 */
	id: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	created_at?: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	updated_at?: string;

	/**
	 * REST endpoint
	 */
	resource_path: string;

	/**
	 * User or system defined name
	 */
	name: string;

	/**
	 * Primary account
	 */
	primary: boolean;

	/**
	 * Account’s type
	 */
	type: coinbase.AccountType;

	/**
	 * Account’s currency (see Client#getCurrencies() for available strings)
	 */
	currency: coinbase.AccountCurrency;

	/**
	 * Balance
	 */
	balance: coinbase.MoneyHash;

	/**
	 * Sell coins
	 */
	sell(opts: coinbase.SellOpts): Promise<Sell>;

}

export interface Client {
	/**
	 * Returns all accounts for the current user
	 * Scope: wallet:accounts:read
	 */
	getAccounts(): Promise<Account[]>;
	/**
	 * Get one account by its Resource ID
	 * Scope: wallet:accounts:read
	 * @param id resource ID or "primary"
	 */
	getAccount(id: string): Promise<Account>;
	/**
	 * Returns all payment methods for the current user
	 * Scope: wallet:payment-methods:read
	 */
	getPaymentMethods(): Promise<coinbase.PaymentMethod[]>;
	/**
	 * Show current user’s payment method.
	 * Scope: wallet:payment-methods:read
	 */
	getPaymentMethod(id: string): Promise<coinbase.PaymentMethod>;

	/**
	 * Get the total price to sell one bitcoin or ether. Note that exchange rates fluctuates so the price is only correct for seconds at the
	 * time.
	 * This sell price includes standard Coinbase fee (1%) but excludes any other fees including bank fees. If you need more accurate price
	 * estimate for a specific payment method or amount, see sell bitcoin endpoint and quote: true option.
	 * Scope: none
	 */
	getSellPrice(opts: coinbase.GetSellPriceOpts): Promise<coinbase.PriceResult>;
}

export type ClientConstructOpts = coinbase.ClientConstructOpts;
