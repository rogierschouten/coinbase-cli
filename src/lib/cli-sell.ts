/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import * as util from "util";

import { Account, Client, PaymentMethod } from "./coinbase";
import { ConsoleOutput } from "./console-output";

/**
 * Allows the user to choose one of his accounts
 * @param client
 * @param output
 * @param accountId optional pre-selected account id; in this case, user is not presented with a choice
 * @param filter only show accounts matching the filter
 */
async function chooseAccount(
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
 * Allows the user to choose one of his accounts
 * @param client
 * @param output
 * @param methodId optional pre-selected id; in this case, user is not presented with a choice
 * @param filter a filter function to not show all payment methods
 */
async function choosePaymentMethod(
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

async function chooseAmount(output: ConsoleOutput, currency: string): Promise<string> {
	output.log();
	const prompt = util.format("Please enter the amount e.g. '30.5', or 'all' to sell all your %s:", currency);
	while (true) {
		output.log(prompt);
		const input = await output.input({});
		if (input === undefined) {
			throw new Error("operation cancelled by user");
		}
		if (input === "all") {
			return "all";
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

/**
 * Sell coins for cash
 * @param args
 * @param output
 * @param client
 */
export async function cmdSell(
	args: { account?: string, paymentMethod?: string, amount?: string, quote?: boolean, commit?: boolean },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	if (args.amount !== undefined && args.amount !== "all" && !(parseFloat(args.amount) > 0)) {
		throw new Error("amount must be a number greater than 0, e.g. '40.5'");
	}
	const account = await chooseAccount(
		client,
		output,
		args.account,
		(account: Account): boolean => account.type === "wallet" && parseFloat(account.balance.amount) > 0
	);
	const paymentMethod = await choosePaymentMethod(client, output, args.paymentMethod, (pm: PaymentMethod): boolean => pm.allow_sell);
	let amount: string;
	if (args.amount) {
		amount = args.amount;
	} else {
		amount = await chooseAmount(output, account.currency.code);
	}
	if (amount === "all") {
		amount = account.balance.amount;
	}
	const order = await output.busyWhile(account.sell({
		agree_btc_amount_varies: true,
		amount,
		commit: false,
		currency: account.currency.code,
		payment_method: paymentMethod.id,
		quote: !!args.quote
	}), "Sending sell order to Coinbase");

	output.log();
	output.log("Sell Order:");
	output.log("- amount   : %s %s", order.amount.amount, order.amount.currency);
	output.log("- fee      : %s %s", order.fee.amount, order.fee.currency);
	output.log("- subtotal : %s %s", order.subtotal.amount, order.subtotal.currency);
	output.log("- total    : %s %s", order.total.amount, order.total.currency);
	output.log("- status   : %s", order.status);
	if (!args.quote) {
		const doCommit = args.commit ? true : 0 === await output.menu({ options: ["Commit", "Cancel"], selectedIndex: 1 });
		if (doCommit) {
			await output.busyWhile(order.commit(), "Committing order on Coinbase");
			output.log("Done!");
		} else {
			output.log("Canceled.");
		}
	}
}

export async function cmdSellPrice(
	args: { currency1: string, currency2: string },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const price = await output.busyWhile(client.getSellPrice({
		currencyPair: `${args.currency1}-${args.currency2}`
	}), "Getting sell price from Coinbase");
	output.log("1 %s = %s %s", price.data.base, price.data.amount, price.data.currency);
}
