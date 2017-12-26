/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import { Account, Client, PaymentMethod } from "./coinbase";
import { ConsoleOutput } from "./console-output";
import { AllowAll, chooseAccount, chooseAmount, choosePaymentMethod } from "./user-input";

/**
 * Buy coins for cash
 * @param args
 * @param output
 * @param client
 */
export async function cmdBuy(
	args: { account?: string, paymentMethod?: string, amount?: string, quote?: boolean, commit?: boolean },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	if (args.amount !== undefined && !(parseFloat(args.amount) > 0)) {
		throw new Error("amount must be a number greater than 0, e.g. '40.5'");
	}
	const account = await chooseAccount(
		client,
		output,
		args.account,
		(account: Account): boolean => account.type === "wallet"
	);
	const paymentMethod = await choosePaymentMethod(client, output, args.paymentMethod, (pm: PaymentMethod): boolean => pm.allow_buy);
	let amount: string;
	if (args.amount) {
		amount = args.amount;
	} else {
		amount = await chooseAmount(output, account.currency.code, AllowAll.No);
	}
	const order = await output.busyWhile(account.buy({
		agree_btc_amount_varies: true,
		amount,
		commit: false,
		currency: account.currency.code,
		payment_method: paymentMethod.id,
		quote: !!args.quote
	}), "Sending buy order to Coinbase");

	output.log();
	output.log("Buy Order:");
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
