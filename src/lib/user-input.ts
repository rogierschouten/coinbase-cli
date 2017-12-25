import * as util from "util";

import { Account, Client, PaymentMethod } from "./coinbase";
import { ConsoleOutput } from "./console-output";

/**
 * Allows the user to choose one of his accounts; if an account id is already provided, only retrieves the selected account from Coinbase
 * @param client Coinbase client
 * @param output UI
 * @param accountId optional pre-selected account id; in this case, user is not presented with a choice
 * @param filter only show accounts matching the filter
 * @returns selected Account
 * @throws if uses cancels
 * @throws whatever coinbase api throws
 */
export async function chooseAccount(
	client: Client,
	output: ConsoleOutput,
	accountId?: string,
	filter?: (account: Account) => boolean
): Promise<Account> {
	if (accountId) {
		try {
			return await output.busyWhile(client.getAccount(accountId), "Retrieving your account from Coinbase");
		} catch (error) {
			throw new Error("error retrieving your account: " + error.message);
		}
	}
	let accounts = await output.busyWhile(client.getAccounts(), "Retrieving your accounts from Coinbase");
	if (filter) {
		accounts = accounts.filter(filter);
	}
	accounts.sort((a: Account, b: Account): number => {
		return (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	});
	// is there anything to choose?
	if (accounts.length === 0) {
		throw new Error("no payment methods available");
	}
	if (accounts.length === 1) {
		const account = accounts[0];
		output.log(
			"Using account: %s, id: %s, balance: %s %s, type: %s\n",
			account.name, account.id, account.balance.amount, account.balance.currency, account.type
		);
		return account;
	}
	// ask user to choose
	output.log();
	while (true) {
		output.log("Please choose an account by typing in its number:");
		let i = 1;
		for (const account of accounts) {
			output.log(
				"%d:   name: %s, id: %s, balance: %s %s, type: %s\n",
				i, account.name, account.id, account.balance.amount, account.balance.currency, account.type
			);
			++i;
		}
		const input = await output.input({});
		if (input === undefined) {
			throw new Error("operation cancelled by user");
		}
		const n = parseInt(input, 10);
		if (n > 0 && n <= accounts.length) {
			return accounts[n - 1];
		}
	}
}

/**
 * Allows the user to choose one of his payment methods. If a methodId is already provided, only that method is retrieved from Coinbase
 * @param client Coinbase client
 * @param output UI
 * @param methodId optional pre-selected id; in this case, user is not presented with a choice
 * @param filter a filter function to not show all payment methods
 * @returns selected payment method
 * @throws if uses cancels
 * @throws whatever coinbase api throws
 */
export async function choosePaymentMethod(
	client: Client,
	output: ConsoleOutput,
	methodId?: string,
	filter?: (pm: PaymentMethod) => boolean
): Promise<PaymentMethod> {
	if (methodId) {
		try {
			return await client.getPaymentMethod(methodId);
		} catch (error) {
			throw new Error("error retrieving your payment method: " + error.message);
		}
	}
	let paymentMethods = await output.busyWhile(client.getPaymentMethods(), "Retrieving your payment methods from Coinbase");
	if (filter) {
		paymentMethods = paymentMethods.filter(filter);
	}
	// is there anything to choose?
	if (paymentMethods.length === 0) {
		throw new Error("no payment methods available");
	}
	if (paymentMethods.length === 1) {
		const paymentMethod = paymentMethods[0];
		output.log(
			"Using payment method: %s, id %s, type: %s, currency: %s\n",
			paymentMethod.name, paymentMethod.id, paymentMethod.type, paymentMethod.currency
		);
		return paymentMethod;
	}
	// ask user to choose
	paymentMethods.sort((a: PaymentMethod, b: PaymentMethod): number => {
		return (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	});
	output.log();
	while (true) {
		output.log("Please choose a payment method by typing in its number:");
		let i = 1;
		for (const paymentMethod of paymentMethods) {
			output.log(
				"%d:   name: %s, id %s, type: %s, currency: %s\n",
				i, paymentMethod.name, paymentMethod.id, paymentMethod.type, paymentMethod.currency
			);
			++i;
		}
		const input = await output.input({});
		if (input === undefined) {
			throw new Error("operation cancelled by user");
		}
		const n = parseInt(input, 10);
		if (n > 0 && n <= paymentMethods.length) {
			return paymentMethods[n - 1];
		}
	}
}

export enum AllowAll {
	Yes,
	No
}

/**
 * Allows the user to enter a floating-point number or 'all'
 * @param client Coinbase client
 * @param output UI
 * @param allowAll allow the user to type 'all'?
 * @returns string with floating-point number, or 'all', or 'undefined'
 * @throws if uses cancels
 * @throws whatever coinbase api throws
 */
export async function chooseAmount(output: ConsoleOutput, currency: string, allowAll: AllowAll): Promise<string> {
	output.log();
	const prompt = util.format("Please enter the amount of %s e.g. '30.5'%s", currency, allowAll === AllowAll.Yes ? ", or 'all'" : "");
	while (true) {
		output.log(prompt);
		const input = await output.input({});
		if (input === undefined) {
			throw new Error("operation cancelled by user");
		}
		if (input === "all") {
			if (allowAll === AllowAll.Yes) {
				return "all";
			} else {
				output.error("please enter a valid amount e.g. '30.5'");
				continue;
			}
		}
		const amount = parseFloat(input);
		if (!Number.isFinite(amount)) {
			output.error("please enter a valid amount e.g. '30.5'");
			continue;
		}
		if (!(amount > 0)) {
			output.error("please enter an amount greater than zero");
			continue;
		}
		return amount.toString(10);
	}
}
