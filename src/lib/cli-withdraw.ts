/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import { Account, Client, PaymentMethod } from "./coinbase";
import { ConsoleOutput } from "./console-output";
import { AllowAll, chooseAccount, chooseAmount, choosePaymentMethod } from "./user-input";

export async function cmdWithdraw(
	args: { account?: string, paymentMethod?: string, amount?: string, commit?: boolean },
	output: ConsoleOutput,
	client: Client
): Promise<void> {
	if (args.amount !== undefined && args.amount !== "all" && !(parseFloat(args.amount) > 0)) {
		throw new Error("amount must be a number greater than 0, e.g. '40.5', or 'all'");
	}
	const account = await chooseAccount(
		client,
		output,
		args.account,
		(account: Account): boolean => account.type === "fiat"
	);
	const paymentMethod = await choosePaymentMethod(client, output, args.paymentMethod, (pm: PaymentMethod): boolean => pm.allow_withdraw);
	let amount: string;
	if (args.amount) {
		amount = args.amount;
	} else {
		amount = await chooseAmount(output, account.currency.code, AllowAll.Yes);
	}
	if (amount === "all") {
		amount = account.balance.amount;
	}
	const order = await output.busyWhile(account.withdraw({
		amount,
		commit: false,
		currency: account.currency.code,
		payment_method: paymentMethod.id
	}), "Sending withdrawal to Coinbase");

	output.log();
	output.log("Withdrawal:");
	output.log("- amount   : %s %s", order.amount.amount, order.amount.currency);
	output.log("- from 	   : %s", account.name);
	output.log("- to   	   : %s", paymentMethod.name);
	output.log("- fee      : %s %s", order.fee.amount, order.fee.currency);
	output.log("- subtotal : %s %s", order.subtotal.amount, order.subtotal.currency);
	output.log("- status   : %s", order.status);
	output.log("- payout   : %s", order.payout_at);
	const doCommit = args.commit ? true : 0 === await output.menu({ options: ["Commit", "Cancel"], selectedIndex: 1 });
	if (doCommit) {
		await output.busyWhile(order.commit(), "Committing order on Coinbase");
		output.log("Done!");
	} else {
		output.log("Canceled.");
	}
}
