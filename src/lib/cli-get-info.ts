/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import { Client } from "./coinbase";
import { ConsoleOutput } from "./console-output";

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
	output.log("1 %s = %s %s", price.data.base, price.data.amount, price.data.currency);
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
