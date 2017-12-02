// Type definitions for coinbase 2.0
// Project: https://github.com/coinbase/coinbase-node
// Definitions by: Rogier Schouten <https://github.com/rogierschouten>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export type Network = "bitcoin" | "litecoin" | "ethereum";

export interface ClientConstructOpts {
	/**
	 * API key (obtain this from the coinbase website)
	 */
	apiKey?: string;
	/**
	 * API key secret (obtain this from the coinbase website)
	 */
	apiSecret?: string;
	/**
	 * OAuth2 access token
	 */
	accessToken?: string;
	/**
	 * API version in 'yyyy-mm-dd' format, see https://developers.coinbase.com/api/v2#changelog
	 */
	version?: string;
}

export interface CreateAccountOpts {
	/**
	 * Account name
	 */
	name?: string;
}

export interface GetExchangeRateOpts {
	/**
	 * Base currency, default USD
	 */
	currency?: string;
}

export interface GetBuyPriceOpts {
	/**
	 * Currency pair, e.g. 'BTC-USD'
	 */
	currencyPair: string;
}

export interface GetSellPriceOpts {
	/**
	 * Currency pair, e.g. 'BTC-USD'
	 */
	currencyPair: string;
}

export interface GetSpotPriceOpts {
	/**
	 * Currency pair, e.g. 'BTC-USD'
	 */
	currencyPair: string;
	/**
	 * Specify date for historic spot price in format YYYY-MM-DD (UTC)
	 */
	date?: string;
}

export interface UpdateAccountOpts {
	/**
	 * Account name
	 */
	name?: string;
}

export interface CreateAddressOpts {
	/**
	 * Address label
	 */
	name?: string;
}

export interface SendMoneyOpts {
	/**
	 * Type send is required when sending money
	 */
	type: "send";
	/**
	 * A bitcoin address, litecoin address, ethereum address, or an email of the recipient
	 */
	to: string;
	/**
	 * Amount to be sent
	 */
	amount: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * Notes to be included in the email that the recipient receives
	 */
	description?: string;
	/**
	 * Don’t send notification emails for small amounts (e.g. tips)
	 */
	skip_notifications?: boolean;
	/**
	 * Transaction fee in BTC/ETH/LTC if you would like to pay it. Fees can be added as a string, such as 0.0005
	 */
	fee?: string;
	/**
	 * *Recommended* A token to ensure idempotence. If a previous transaction with the same idem parameter already exists for this sender,
	 * that previous transaction will be returned and a new one will not be created. Max length 100 characters
	 */
	idem?: string;
	/**
	 * Whether this send is to another financial institution or exchange. Required if this send is to an address and is valued at over USD$3000.
	 */
	to_financial_institution?: boolean;
	/**
	 * The website of the financial institution or exchange. Required if to_financial_institution is true.
	 */
	financial_institution_website?: string;
}

export interface TransferMoneyOpts {
	/**
	 * Type transfer is required when transferring bitcoin or ethereum between accounts
	 */
	type: "transfer";
	/**
	 * ID of the receiving account
	 */
	to: string;
	/**
	 * Amount to be transferred
	 */
	amount: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * Notes to be included in the transfer
	 */
	description?: string;
}

export interface RequestMoneyOpts {
	/**
	 * Type request is required when sending money
	 */
	type: "request";
	/**
	 * An email of the recipient
	 */
	to: string;
	/**
	 * Amount to be transferred
	 */
	amount: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * Notes to be included in the email that the recipient receives
	 */
	description?: string;
}

export interface UpdateUserOpts {
	/**
	 * User’s public name
	 */
	name?: string;
	/**
	 * Time zone
	 */
	time_zone?: string;
	/**
	 * Local currency used to display amounts converted from BTC
	 */
	native_currency?: string;
}

export interface BuyOpts {
	/**
	 * Buy amount without fees (alternative to total)
	 */
	amount?: string;
	/**
	 * Buy amount with fees (alternative to amount)
	 */
	total?: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * The ID of the payment method that should be used for the buy. (todo get payment methods)
	 */
	payment_method?: string;
	/**
	 * Whether or not you would still like to buy if you have to wait for your money to arrive to lock in a price
	 */
	agree_btc_amount_varies?: boolean;
	/**
	 * If set to false, this buy will not be immediately completed. Use the commit call to complete it. Default value: true
	 */
	commit?: boolean;
	/**
	 * If set to true, response will return an unsave buy for detailed price quote. Default value: false
	 */
	quote?: boolean;
}

export interface SellOpts {
	/**
	 * Sell amount without fees (alternative to total)
	 */
	amount?: string;
	/**
	 * Sell amount with fees (alternative to amount)
	 */
	total?: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * The ID of the payment method that should be used for the sell.
	 */
	payment_method?: string;
	/**
	 * Whether or not you would still like to sell if you have to wait for your money to arrive to lock in a price
	 */
	agree_btc_amount_varies?: boolean;
	/**
	 * If set to false, this sell will not be immediately completed. Use the commit call to complete it. Default value: true
	 */
	commit?: boolean;
	/**
	 * If set to true, response will return an unsave sell for detailed price quote. Default value: false
	 */
	quote?: boolean;
}

export interface DepositOpts {
	/**
	 * Deposit amount
	 */
	amount: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * The ID of the payment method that should be used for the buy. (todo get payment methods)
	 */
	payment_method?: string;
	/**
	 * If set to false, this deposit will not be immediately completed. Use the commit call to complete it. Default value: true
	 */
	commit?: boolean;
}


export interface WithdrawOpts {
	/**
	 *Withdrawal amount
	 */
	amount: string;
	/**
	 * Currency for the amount (see Client#getCurrencies() for available strings)
	 */
	currency: string;
	/**
	 * The ID of the payment method that should be used for the buy. (todo get payment methods)
	 */
	payment_method?: string;
	/**
	 * If set to false, this withdrawal will not be immediately completed. Use the commit call to complete it. Default value: true
	 */
	commit?: boolean;
}

/**
 * Combination of an amount and a currency
 */
export interface MoneyHash {
	/**
	 * Amount as floating-point in a string
	 */
	amount: string;
	/**
	 * Currency e.g. "BTC" (see Client#getCurrencies() for available strings)
	 */
	currency: string;
}

export type ResourceType = "account" | "transaction" | "address" | "user" | "buy" | "sell" | "deposit" | "withdrawal" | "payment_method";

/**
 * Base interface for all resources
 */
export interface Resource {
	/**
	 * Resource type
	 */
	resource: ResourceType;

}

export class User implements Resource {
	/**
	 * Resource type, constant "user"
	 */
	public resource: "user";

	/**
	 * Resource ID
	 */
	public id: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public created_at?: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public updated_at?: string;

	/**
	 * REST endpoint
	 */
	public resource_path: string;

	/**
	 * User’s public name
	 */
	public name?: string;

	/**
	 *
	 */
	public username?: string;

	/**
	 * Location for user’s public profile
	 */
	public profile_location?: string;

	/**
	 * Bio for user’s public profile
	 */
	public profile_bio?: string;

	/**
	 * Public profile location if user has one
	 */
	public profile_url?: string;

	/**
	 * User’s avatar url
	 */
	public avatar_url: string;

	/**
	 * Time zone (needs wallet:user:read permission)
	 */
	public time_zone?: string;

	/**
	 * Native currency (needs wallet:user:read permission)
	 */
	public native_currency?: string;

	/**
	 * (needs wallet:user:read permission)
	 */
	public bitcoin_unit?: string;

	/**
	 * (needs wallet:user:read permission)
	 */
	public country?: Country;

	/**
	 * Email address (needs wallet:user:email permission)
	 */
	public email?: string;

	/**
	 * Get current user’s authorization information including granted scopes and send limits when using OAuth2 authentication
	 * No permission required
	 * @param cb
	 */
	public showAuth(cb: (error: Error, result: Auth) => void): void;

	/**
	 * Change user properties
	 * Scope: wallet:user:update
	 * @param opts
	 * @param cb
	 */
	public update(opts: UpdateUserOpts, cb: (error: Error, result: User) => void): void;
}

export interface Auth {
	/**
	 * Authentication method e.g. "oauth"
	 */
	method: string;
	/**
	 * Permissions for this user e.g. "wallet:user:read"
	 */
	scopes: string[];

	oauth_meta?: any;
}

export interface Country {
	/**
	 * 2-letter country code
	 */
	code: string;
	/**
	 * Country name
	 */
	name: string;
}

/**
 * Bitcoin, Litecoin or Ethereum address
 */
export class Address implements Resource {
	/**
	 * Type of resource, constant string "address"
	 */
	public resource: "address";

	/**
	 * Bitcoin, Litecoin or Ethereum address
	 */
	public address: string;

	/**
	 * User defined label for the address
	 */
	public name?: string;

	/**
	 * List transactions that have been sent to a specific address.
	 * Scope: wallet:transactions:read
	 * @param opts
	 * @param cb
	 */
	public getTransactions(opts: {}, cb: (error: Error, result: Transaction[]) => void): void;
}

export type AccountType = "wallet" | "fiat" | "multisig" | "vault" | "multisig_vault";

/**
 * Account resource represents all of a user’s accounts, including bitcoin, litecoin and ethereum wallets, fiat currency accounts,
 * and vaults. This is represented in the type field. It’s important to note that new types can be added over time so you want to
 * make sure this won’t break your implementation.
 * User can only have one primary account and it’s type can only be wallet.
 */
export class Account implements Resource {
	/**
	 * Type of resource, constant string "account"
	 */
	public resource: "account";

	/**
	 * Resource ID
	 */
	public id: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public created_at?: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public updated_at?: string;

	/**
	 * REST endpoint
	 */
	public resource_path: string;

	/**
	 * User or system defined name
	 */
	public name: string;

	/**
	 * Primary account
	 */
	public primary: boolean;

	/**
	 * Account’s type
	 */
	public type: AccountType;

	/**
	 * Account’s currency (see Client#getCurrencies() for available strings)
	 */
	public currency: string;

	/**
	 * Balance
	 */
	public balance: MoneyHash;

	/**
	 * Promote an account as primary account.
	 * Scope: wallet:accounts:update
	 * @param cb
	 */
	public setPrimary(cb: (error: Error, result: Account) => void): void;

	/**
	 * Modifies user’s account.
	 * Scope: wallet:accounts:update
	 * @param opts
	 * @param cb
	 */
	public update(opts: UpdateAccountOpts, cb: (error: Error, result: Account) => void): void;

	/**
	 * Removes user’s account. In order to remove an account it can’t be:
	 * - Primary account
	 * - Account with non-zero balance
	 * - Fiat account
	 * - Vault with a pending withdrawal
	 * Scope: wallet:accounts:delete
	 * @param cb
	 */
	public delete(cb: (error: Error) => void): void;

	/**
	 * Lists addresses for an account. Important: Addresses should be considered one time use only. Create new addresses.
	 * Scope: wallet:addresses:read
	 * @param cb
	 */
	public getAddresses(cb: (error: Error, result: Address[]) => void): void;

	/**
	 * Show an individual address for an account. A regular bitcoin, litecoin or ethereum address can be used in place of address_id but the
	 * address has to be associated to the correct account. Important: Addresses should be considered one time use only. Create new addresses.
	 * Scope: wallet:addresses:read
	 * @param cb
	 */
	public getAddress(cb: (error: Error, result: Address) => void): void;

	/**
	 * Creates a new address for an account. As all the arguments are optinal, it’s possible just to do a empty POST which will create a new
	 * address. This is handy if you need to create new receive addresses for an account on-demand.
	 * Addresses can be created for all account types. With fiat accounts, funds will be received with Instant Exchange
	 * Scope: wallet:addresses:create
	 * @param opts can be null, optional address name
	 * @param cb
	 */
	public createAddress(opts: CreateAddressOpts | null, cb: (error: Error, result: Address) => void): void;

	/**
	 * Lists account’s transactions.
	 * Scope: wallet:transactions:read
	 * @param cb
	 */
	public getTransactions(cb: (error: Error, result: Transaction[]) => void): void;

	/**
	 * Show an individual transaction for an account
	 * Scope: wallet:transactions:read
	 * @param id resource id
	 * @param cb
	 */
	public getTransaction(id: string, cb: (error: Error, result: Transaction) => void): void;


	/**
	 * Send funds to a bitcoin address, litecoin address, ethereum address, or email address. No transaction fees are required for off
	 * blockchain bitcoin transactions.
	 *
	 * It’s recommended to always supply a unique `idem` field for each transaction. This prevents you from sending the same transaction
	 * twice if there has been an unexpected network outage or other issue.
	 *
	 * When used with OAuth2 authentication, this endpoint requires two factor authentication unless used with
	 * wallet:transactions:send:bypass-2fa scope.
	 *
	 * If the user is able to buy bitcoin, they can send funds from their fiat account using instant exchange feature.
	 * Buy fees will be included in the created transaction and the recipient will receive the user defined amount.
	 * To create a multisig transaction, visit Multisig documentation.
	 *
	 * Scope: wallet:transactions:send, wallet:transactions:send:bypass-2fa
	 * @param opts
	 * @param cb
	 */
	public sendMoney(opts: SendMoneyOpts, cb: (error: Error, result: Transaction) => void): void;

	/**
	 * Transfer bitcoin, litecoin or ethereum between two of a user’s accounts. Following transfers are allowed:
	 * - wallet to wallet
	 * - wallet to vault
	 * Scope: wallet:transactions:transfer
	 * @param opts
	 * @param cb
	 */
	public transferMoney(opts: TransferMoneyOpts, cb: (error: Error, result: Transaction) => void): void;

	/**
	 * Requests money from an email address.
	 * Scope: wallet:transactions:request
	 * @param opts
	 * @param cb
	 */
	public requestMoney(opts: RequestMoneyOpts, cb: (error: Error, result: Transaction) => void): void;

	/**
	 * Lists buys for an account.
	 * Scope: wallet:buys:read
	 * @param cb
	 */
	public getBuys(cb: (error: Error, result: Buy[]) => void): void;

	/**
	 * Show an individual buy.
	 * Scope: wallet:buys:read
	 * @param id resource id
	 * @param cb
	 */
	public getBuy(id: string, cb: (error: Error, result: Buy) => void): void;

	/**
	 * Buys a user-defined amount of bitcoin, litecoin or ethereum.
	 * There are two ways to define buy amounts–you can use either the amount or the total parameter:
	 * - When supplying amount, you’ll get the amount of bitcoin, litecoin or ethereum defined. With amount it’s recommended to use BTC or
	 *   ETH as the currency value, but you can always specify a fiat currency and and the amount will be converted to BTC or ETH respectively.
	 * - When supplying total, your payment method will be debited the total amount and you’ll get the amount in BTC or ETH after fees have
	 *   been reduced from the total. With total it’s recommended to use the currency of the payment method as the currency parameter,
	 *   but you can always specify a different currency and it will be converted.
	 * Given the price of digital currency depends on the time of the call and on the amount of purchase, it’s recommended to use the
	 * commit: false parameter to create an uncommitted buy to show the confirmation for the user or get the final quote, and commit that
	 * with a separate request.
	 * If you need to query the buy price without locking in the buy, you can use quote: true option. This returns an unsaved buy and
	 * unlike commit: false, this buy can’t be completed. This option is useful when you need to show the detailed buy price quote
	 * for the user when they are filling a form or similar situation.
	 * Scope: wallet:buys:create
	 * @param opts indicates what to buy
	 * @param cb receives transaction that you can use to commit the buy
	 */
	public buy(opts: BuyOpts, cb: (error: Error, result: Buy) => void): void;

	/**
	 * Lists sells for an account.
	 * Scope: wallet:sells:read
	 * @param cb
	 */
	public getSells(cb: (error: Error, result: Sell[]) => void): void;

	/**
	 * Show an individual sell.
	 * Scope: wallet:sells:read
	 * @param id resource id
	 * @param cb
	 */
	public getSell(id: string, cb: (error: Error, result: Sell) => void): void;

	/**
	 * Sells a user-defined amount of bitcoin, litecoin or ethereum.
	 *
	 * There are two ways to define sell amounts–you can use either the amount or the total parameter:
	 * - When supplying amount, you’ll get the amount of bitcoin, litecoin or ethereum defined. With amount it’s recommended to use BTC or
	 *   ETH as the currency value, but you can always specify a fiat currency and the amount will be converted to BTC or ETH respectively.
	 * - When supplying total, your payment method will be credited the total amount and you’ll get the amount in BTC or ETH after fees
	 *   have been reduced from the subtotal. With total it’s recommended to use the currency of the payment method as the currency parameter,
	 *   but you can always specify a different currency and it will be converted.
	 *
	 * Given the price of digital currency depends on the time of the call and amount of the sell, it’s recommended to use the commit: false
	 * parameter to create an uncommitted sell to get a quote and then to commit that with a separate request.
	 *
	 * If you need to query the sell price without locking in the sell, you can use quote: true option. This returns an unsaved sell and
	 * unlike commit: false, this sell can’t be completed. This option is useful when you need to show the detailed sell price quote for
	 * the user when they are filling a form or similar situation.
	 * Scope: wallet:sells:create
	 * @param opts
	 * @param cb
	 */
	public sell(opts: SellOpts, cb: (error: Error, result: Sell) => void): void;

	/**
	 * Lists deposits for an account.
	 * Scope: wallet:deposits:read
	 * @param cb
	 */
	public getDeposits(cb: (error: Error, result: Deposit[]) => void): void;

	/**
	 * Show an individual deposit.
	 * Scope: wallet:deposits:read
	 * @param id resource id
	 * @param cb
	 */
	public getDeposit(id: string, cb: (error: Error, result: Deposit) => void): void;

	/**
	 * Deposits user-defined amount of funds to a fiat account.
	 * Scope: wallet:deposits:create
	 * @param opts
	 * @param cb
	 */
	public deposit(opts: DepositOpts, cb: (error: Error, result: Deposit) => void): void;

	/**
	 * Lists withdrawals for an account.
	 * Scope: wallet:withdrawals:read
	 * @param cb
	 */
	public getWithdrawals(cb: (error: Error, result: Withdrawal[]) => void): void;

	/**
	 * Show an individual withdrawal.
	 * Scope: wallet:withdrawals:read
	 * @param id resource id
	 * @param cb
	 */
	public getWithdrawal(id: string, cb: (error: Error, result: Withdrawal) => void): void;

	/**
	 * Withdraws user-defined amount of funds from a fiat account.
	 * Scope: wallet:withdrawals:create
	 * @param opts
	 * @param cb
	 */
	public withdraw(opts: WithdrawOpts, cb: (error: Error, result: Withdrawal) => void): void;
}

/**
 * Reference to any resource
 */
export interface ResourceRef {
	id: string;
	resource: ResourceType;
	resource_path: string;
}

export type TransactionType = "send" | "request" | "transfer" | "buy" | "sell" | "fiat_deposit" | "fiat_withdrawal" | "exchange_deposit"
	| "exchange_withdrawal" | "vault_withdrawal";


export type TransactionStatus = "pending" | "completed" | "failed" | "expired" | "canceled" | "waiting_for_signature" | "waiting_for_clearing";

export class Transaction implements Resource{
	/**
	 * Constant "transaction"
	 */
	public resource: "transaction";

	/**
	 * Transaction type
	 */
	public type: TransactionType;

	/**
	 * Transaction status
	 */
	public status: TransactionStatus;

	/**
	 * Amount in bitcoin, litecoin or ethereum
	 */
	public amount: MoneyHash;

	/**
	 * Amount in user's native currency
	 */
	public native_amount: MoneyHash;

	/**
	 * Account associated with the transaction
	 */
	public account: Account;

	/**
	 * User defined description
	 */
	public description: string;

	/**
	 * Indicator if the transaction was instant exchanged (received into a bitcoin address for a fiat account)
	 */
	public instant_exchange: boolean;

	/**
	 * Detailed information about the transaction
	 */
	public details: any;

	/**
	 * Information about bitcoin, litecoin or ethereum network including network transaction hash if transaction was on-blockchain.
	 * Only available for certain types of transactions
	 */
	public network?: any;

	/**
	 * The receiving party of a debit transaction. Usually another resource but can also be another type like email.
	 * Only available for certain types of transactions
	 */
	public to?: ResourceRef | string;

	/**
	 * The originating party of a credit transaction. Usually another resource but can also be another type like bitcoin network.
	 * Only available for certain types of transactions
	 */
	public from?: ResourceRef | string;

	/**
	 * Associated bitcoin, litecoin or ethereum address for received payment
	 */
	public address?: Address;

	/**
	 * Associated OAuth2 application
	 */
	public application?: any;

	/**
	 * Lets the recipient of a money request complete the request by sending money to the user who requested the money.
	 * This can only be completed by the user to whom the request was made, not the user who sent the request.
	 * Scope: wallet:transactions:request
	 * @param cb
	 */
	public complete(cb: (error: Error, result: any) => void): void;

	/**
	 * Lets the user resend a money request. This will notify recipient with a new email.
	 * Scope: wallet:transactions:request
	 * @param cb
	 */
	public resend(cb: (error: Error, result: any) => void): void;

	/**
	 * Lets a user cancel a money request. Money requests can be canceled by the sender or the recipient.
	 * Scope: wallet:transactions:request
	 * @param cb
	 */
	public cancel(cb: (error: Error, result: any) => void): void;
}


export type BuyStatus = "created" | "completed" | "canceled";

/**
 * Buy resource
 */
export class Buy implements Resource {
	/**
	 * Constant "buy"
	 */
	public resource: "buy";

		/**
	 * Status
	 */
	public status: BuyStatus;

	/**
	 * Associated payment method (e.g. a bank, fiat account)
	 */
	public payment_method: ResourceRef;

	/**
	 * Associated transaction (e.g. a bank, fiat account)
	 */
	public transaction: ResourceRef;

	/**
	 * Amount in bitcoin, litecoin or ethereum
	 */
	public amount: MoneyHash;

	/**
	 * Fiat amount with fees
	 */
	public total: MoneyHash;

	/**
	 * Fiat amount without fees
	 */
	public subtotal: MoneyHash;

	/**
	 * Fee associated to this buy
	 */
	public fee: MoneyHash;

	/**
	 * Has this buy been committed?
	 */
	public committed: boolean;

	/**
	 * Was this buy executed instantly?
	 */
	public instant: boolean;

	/**
	 * When a buy isn’t executed instantly, it will receive a payout date for the time it will be executed. ISO timestamp
	 */
	public payout_at?: string;

	/**
	 * Completes a buy that is created in commit: false state.
	 * If the exchange rate has changed since the buy was created, this call will fail with the error “The exchange rate updated while you
	 * were waiting. The new total is shown below”. The buy’s total will also be updated. You can repeat the `commit` call to accept the new
	 * values and start the buy at the new rates.
	 * Scope: wallet:buys:create
	 * @param cb
	 */
	public commit(cb: (error: Error, transaction: Buy) => void): void;
}


export type SellStatus = "created" | "completed" | "canceled";

/**
 * Sell resource
 */
export class Sell implements Resource {
	/**
	 * Constant "sell"
	 */
	public resource: "sell";

	/**
	 * Status of the sell. Currently available values: created, completed, canceled
	 */
	public status: BuyStatus;

	/**
	 * Associated payment method (e.g. a bank, fiat account)
	 */
	public payment_method: ResourceRef;

	/**
	 * Associated transaction (e.g. a bank, fiat account)
	 */
	public transaction: ResourceRef;

	/**
	 * Amount in bitcoin, litecoin or ethereum
	 */
	public amount: MoneyHash;

	/**
	 * Fiat amount with fees
	 */
	public total: MoneyHash;

	/**
	 * Fiat amount without fees
	 */
	public subtotal: MoneyHash;

	/**
	 * Fee associated to this sell
	 */
	public fee: MoneyHash;

	/**
	 * Has this sell been committed?
	 */
	public committed: boolean;

	/**
	 * Was this sell executed instantly?
	 */
	public instant: boolean;

	/**
	 * When a sell isn’t executed instantly, it will receive a payout date for the time it will be executed. ISO timestamp
	 */
	public payout_at?: string;

	/**
	 * Completes a sell that is created in commit: false state.
	 * If the exchange rate has changed since the sell was created, this call will fail with the error “The exchange rate updated while you
	 * were waiting. The new total is shown below”. The buy’s total will also be updated. You can repeat the `commit` call to accept the new
	 * values and start the buy at the new rates.
	 * Scope: wallet:sells:create
	 * @param cb
	 */
	public commit(cb: (error: Error, transaction: Sell) => void): void;
}


export type DepositStatus = "created" | "completed" | "canceled";

/**
 * Deposit resource represents a deposit of funds using a payment method (e.g. a bank). Each committed deposit also has an associated transaction.
 * Deposits can be started with commit: false which is useful when displaying the confirmation for a deposit.
 * These deposits will never complete and receive an associated transaction unless they are committed separately.
 */
export class Deposit implements Resource {
	public resource: "deposit";

	/**
	 * Resource ID
	 */
	public id: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public created_at?: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public updated_at?: string;

	/**
	 * REST endpoint
	 */
	public resource_path: string;

	/**
	 * Status of the deposit. Currently available values: created, completed, canceled
	 */
	public status: DepositStatus;

	/**
	 * Associated payment method (e.g. a bank)
	 */
	public payment_method: ResourceRef;

	/**
	 * Associated transaction (e.g. a bank, fiat account)
	 */
	public transaction: ResourceRef;

	/**
	 * Amount
	 */
	public amount: MoneyHash;

	/**
	 * Amount without fees
	 */
	public subtotal: MoneyHash;

	/**
	 * Fee associated to this deposit
	 */
	public fee: MoneyHash;

	/**
	 * Has this deposit been committed?
	 */
	public committed: boolean;

	/**
	 * When a deposit isn’t executed instantly, it will receive a payout date for the time it will be executed. ISO timestamp
	 */
	public payout_at?: string;

	/**
	 * Completes a deposit that is created in commit: false state.
	 * Scope: wallet:deposits:create
	 * @param cb
	 */
	public commit(cb: (error: Error, result: Deposit) => void): void;
}

export type WithdrawalStatus = "created" | "completed" | "canceled";

/**
 * Withdrawal resource represents a withdrawal of funds using a payment method (e.g. a bank). Each committed withdrawal also has a associated
 * transaction.
 * Withdrawal can be started with commit: false which is useful when displaying the confirmation for a withdrawal. These withdrawals will
 * never complete and receive an associated transaction unless they are committed separately.
 */
export class Withdrawal implements Resource {
	public resource: "deposit";

	/**
	 * Resource ID
	 */
	public id: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public created_at?: string;

	/**
	 * ISO timestamp (sometimes needs additional permissions)
	 */
	public updated_at?: string;

	/**
	 * REST endpoint
	 */
	public resource_path: string;

	/**
	 * Status of the deposit. Currently available values: created, completed, canceled
	 */
	public status: WithdrawalStatus;

	/**
	 * Associated payment method (e.g. a bank)
	 */
	public payment_method: ResourceRef;

	/**
	 * Associated transaction (e.g. a bank, fiat account)
	 */
	public transaction: ResourceRef;

	/**
	 * Amount
	 */
	public amount: MoneyHash;

	/**
	 * Amount without fees
	 */
	public subtotal: MoneyHash;

	/**
	 * Fee associated to this withdrawal
	 */
	public fee: MoneyHash;

	/**
	 * Has this withdrawal been committed?
	 */
	public committed: boolean;

	/**
	 * When a withdrawal isn’t executed instantly, it will receive a payout date for the time it will be executed. ISO timestamp
	 */
	public payout_at?: string;

	/**
	 * Completes a withdrawal that is created in commit: false state.
	 * Scope: wallet:withdrawals:create
	 * @param cb
	 */
	public commit(cb: (error: Error, result: Withdrawal) => void): void;
}

export type PaymentMethodType = "ach_bank_account" | "sepa_bank_account" | "ideal_bank_account" | "fiat_account" | "bank_wire"
	| "credit_card" | "secure3d_card" | "eft_bank_account" | "interac";


/**
 * Payment method resource represents the different kinds of payment methods that can be used when buying and selling bitcoin, litecoin or
 * ethereum.
 * As fiat accounts can be used for buying and selling, they have an associated payment method. This type of a payment method will also have
 * a fiat_account reference to the actual account.
 *
 * Currently available type values:
 * - ach_bank_account - Regular US bank account
 * - sepa_bank_account - European SEPA bank account
 * - ideal_bank_account - iDeal bank account (Europe)
 * - fiat_account - Fiat nominated Coinbase account
 * - bank_wire - Bank wire (US only)
 * - credit_card - Credit card (can’t be used for buying/selling)
 * - secure3d_card - Secure3D verified payment card
 * - eft_bank_account - Canadian EFT bank account
 * - interac - Interac Online for Canadian bank accounts
 */
export interface PaymentMethod extends Resource {
	/**
	 * Resource type, constant "payment_method"
	 */
	resource: "payment_method";

	/**
	 * Payment method type
	 */
	type: PaymentMethodType;

	/**
	 * Method name
	 */
	name: string;

	/**
	 * Payment method’s native currency (see Client#getCurrencies() for available strings)
	 */
	currency: string;

	/**
	 * Is primary buying method?
	 */
	primary_buy: boolean;

	/**
	 * Is primary selling method?
	 */
	primary_sell: boolean;

	/**
	 * Is buying allowed with this method?
	 */
	allow_buy: boolean;

	/**
	 * Is selling allowed with this method?
	 */
	allow_sell: boolean;

	/**
	 * Does this method allow for instant buys?
	 */
	instant_buy: boolean;

	/**
	 * Does this method allow for instant sells?
	 */
	instant_sell: boolean;

	/**
	 * If the user has obtained optional wallet:payment-methods:limits permission, an additional field, limits, will be embedded into payment
	 * method data. It will contain information about buy, instant buy, sell and deposit limits (there’s no limits for withdrawals at this time).
	 * As each one of these can have several limits you should always look for the lowest remaining value when performing the relevant action.
	 */
	limits?: PaymentMethodLimits;
}

/**
 * This contains information about buy, instant buy, sell and deposit limits (there’s no limits for withdrawals at this time).
 * As each one of these can have several limits you should always look for the lowest remaining value when performing the relevant action.
 */
export interface PaymentMethodLimits {
	buy: PaymentMethodLimit[];
	instant_buy: PaymentMethodLimit[];
	sell: PaymentMethodLimit[]
	deposit: PaymentMethodLimit[];
}

export interface PaymentMethodLimit {
	period_in_days: number;
	total: MoneyHash;
	remaining: MoneyHash;
}

/**
 * Information about one supported currency.  Currency codes will conform to the ISO 4217 standard where possible.
 * Currencies which have or had no representation in ISO 4217 may use a custom code (e.g. BTC).
 */
export interface Currency {
	/**
	 * Abbreviation e.g. "USD" or "BTC"
	 */
	id: string;
	/**
	 * Full name e.g. "United Arab Emirates Dirham"
	 */
	name: string;
	/**
	 * Floating-point number in a string
	 */
	min_size: string;
}

export interface ExchangeRate {
	/**
	 * Base currency
	 */
	currency: string;
	/**
	 * Rates as floating points in strings; indexed by currency id
	 */
	rates: { [index: string]: string };
}

export interface Time {
	iso: string;
	epoch: number;
}

export class Client {
	/**
	 *
	 * @param opts
	 */
	constructor(opts: ClientConstructOpts);

	/**
	 * Get any user’s public information with their ID.
	 * Scopes: none
	 * @param id resource id
	 * @param cb
	 */
	public getUser(id: string, cb: (error: Error, result: User) => void): void;

	/**
	 * Get the current user. To get user’s email or private information, use permissions wallet:user:email and wallet:user:read. If current
	 * request has a wallet:transactions:send scope, then the response will contain a boolean sends_disabled field that indicates
	 * if the user’s send functionality has been disabled.
	 * @param cb
	 */
	public getCurrentUser(cb: (error: Error, result: User) => void): void;

	/**
	 * Returns all accounts for the current user
	 * Scope: wallet:accounts:read
	 * @param opts
	 * @param cb
	 */
	public getAccounts(opts: {}, cb: (error: Error, result: Account[]) => void): void;

	/**
	 * Get one account by its Resource ID
	 * Scope: wallet:accounts:read
	 * @param id resource ID or "primary"
	 * @param cb
	 */
	public getAccount(id: string, cb: (error: Error, result: Account) => void): void;

	/**
	 * Creates a new account for user.
	 * Scopes: wallet:accounts:create
	 * @param opts
	 * @param cb
	 */
	public createAccount(opts: CreateAccountOpts, cb: (error: Error, result: Account) => void): void;

	/**
	 * Lists current user’s payment methods
	 * Scope: wallet:payment-methods:read
	 * @param cb
	 */
	public getPaymentMethods(cb: (error: Error, result: PaymentMethod[]) => void): void;

	/**
	 * Show current user’s payment method.
	 * Scope: wallet:payment-methods:read
	 * @param cb
	 */
	public getPaymentMethods(cb: (error: Error, result: PaymentMethod) => void): void;

	/**
	 * List known currencies. Currency codes will conform to the ISO 4217 standard where possible. Currencies which have or had no
	 * representation in ISO 4217 may use a custom code (e.g. BTC).
	 * Scope: none
	 * @param cb
	 */
	public getCurrencies(cb: (error: Error, result: Currency[]) => void): void;

	/**
	 * Get current exchange rates. Default base currency is USD but it can be defined as any supported currency.
	 * Returned rates will define the exchange rate for one unit of the base currency.
	 * Scope: none
	 * @param opts
	 * @param cb
	 */
	public getExchangeRates(opts: GetExchangeRateOpts, cb: (error: Error, result: ExchangeRate) => void): void;

	/**
	 * Get the total price to buy one bitcoin or ether. Note that exchange rates fluctuates so the price is only correct for seconds at the time.
	 * This buy price includes standard Coinbase fee (1%) but excludes any other fees including bank fees.
	 * If you need more accurate price estimate for a specific payment method or amount, @see Account#buy() and `quote: true` option.
	 * Scope: none
	 * @param opts
	 * @param cb
	 */
	public getBuyPrice(opts: GetBuyPriceOpts, cb: (error: Error, result: MoneyHash) => void): void;

	/**
	 * Get the total price to sell one bitcoin or ether. Note that exchange rates fluctuates so the price is only correct for seconds at the time.
	 * This sell price includes standard Coinbase fee (1%) but excludes any other fees including bank fees. If you need more accurate price
	 * estimate for a specific payment method or amount, see sell bitcoin endpoint and quote: true option.
	 * Scope: none
	 * @param opts
	 * @param cb
	 */
	public getSellPrice(opts: GetSellPriceOpts, cb: (error: Error, result: MoneyHash) => void): void;

	/**
	 * Get the current market price for bitcoin. This is usually somewhere in between the buy and sell price.
	 * Note that exchange rates fluctuates so the price is only correct for seconds at the time.
	 * You can also get historic prices with date parameter.
	 * Scope: none
	 * @param opts
	 * @param cb
	 */
	public getSpotPrice(opts: GetSpotPriceOpts, cb: (error: Error, result: MoneyHash) => void): void;

	/**
	 * Get the API server time.
	 * @param cb
	 */
	public getTime(cb: (error: Error, result: Time) => void): void;

}
