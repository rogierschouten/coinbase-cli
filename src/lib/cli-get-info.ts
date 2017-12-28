/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import { Account, Client, PaymentMethod } from "./coinbase";
import { ConsoleOutput } from "./console-output";

export async function cmdAccounts(
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const accounts = await client.getAccounts();
	accounts.sort((a: Account, b: Account): number => {
		return (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	});
	if (accounts.length === 0) {
		output.log("no accounts available");
	}
	for (const account of accounts) {
		output.log(
			"name: %s, id: %s, balance: %s %s, type: %s",
			account.name, account.id, account.balance.amount, account.balance.currency, account.type
		);
	}
}

export async function cmdPaymentMethods(
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const paymentMethods = await client.getPaymentMethods();
	paymentMethods.sort((a: PaymentMethod, b: PaymentMethod): number => {
		return (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
	});
	if (paymentMethods.length === 0) {
		output.log("no payment methods available");
	}
	for (const paymentMethod of paymentMethods) {
		output.log(
			"name: %s, id %s, type: %s, currency: %s",
			paymentMethod.name, paymentMethod.id, paymentMethod.type, paymentMethod.currency
		);
	}
}

/**
 * CLI command for getting the current buy price of a coin
 * @param args The currency pair
 * @param output UI
 * @param client Coinbase client
 */
export async function cmdBuyPrice(
	args: { currency1: string, currency2: string },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const price = await output.busyWhile(client.getBuyPrice({
		currencyPair: `${args.currency1}-${args.currency2}`
	}), "Getting buy price from Coinbase");
	output.log("buy: 1 %s = %s %s", price.data.base, price.data.amount, price.data.currency);
}

export async function cmdSellPrice(
	args: { currency1: string, currency2: string },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const price = await output.busyWhile(client.getSellPrice({
		currencyPair: `${args.currency1}-${args.currency2}`
	}), "Getting sell price from Coinbase");
	output.log("sell: 1 %s = %s %s", price.data.base, price.data.amount, price.data.currency);
}

export async function cmdSpotPrice(
	args: { currency1: string, currency2: string },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const price = await output.busyWhile(client.getSpotPrice({
		currencyPair: `${args.currency1}-${args.currency2}`
	}), "Getting spot price from Coinbase");
	output.log("spot: 1 %s = %s %s", price.data.base, price.data.amount, price.data.currency);
}

export async function cmdTime(
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	const time = await output.busyWhile(client.getTime(), "Getting time from Coinbase");
	output.log("Coinbase: %s", time.data.iso);
	output.log("You     : %s", new Date().toISOString());
}
