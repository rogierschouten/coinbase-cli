/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */
import * as yargs from "yargs";

import { cmdGet, cmdSet, cmdUnset } from "./cli-configuration";
import { cmdSell, cmdSellPrice } from "./cli-sell";
import { Client, ClientImpl } from "./coinbase-impl";
import { ClientMock } from "./coinbase-mock";
import { Configuration, ConfigurationMgrImpl } from "./configuration-impl";
import { ConsoleOutput, ConsoleOutputImpl } from "./console-output-impl";

const output = new ConsoleOutputImpl();
const cfgMgr = new ConfigurationMgrImpl();

/**
 * Provides basic error handling around each command implementation
 * @param handler command handler
 */
function handleCommandResult(p: Promise<void>): void {
	p.then(() => {
			process.exit(0);
		})
		.catch((error: Error): void => {
			output.error(error.message);
			process.exit(1);
		});
}

/**
 * Returns a coinbase client after possibly asking the user for api key and secret
 * @param args
 * @param config
 * @param output
 * @param clientFactory
 */
async function ensureClient(
	args: { apiKey?: string, apiSecret?: string, mock?: boolean },
	config: Configuration,
	output: ConsoleOutput
): Promise<Client> {
	let apiKey = args.apiKey || config.variables.apiKey;
	let apiSecret = args.apiSecret || config.variables.apiSecret;
	if (!apiKey) {
		output.log("Please enter your API key:");
		apiKey = await output.input({});
	}
	if (!apiSecret) {
		output.log("Please enter your API secret:");
		apiSecret = await output.input({});
	}
	if (args.mock) {
		return new ClientMock();
	} else {
		return new ClientImpl({ apiKey, apiSecret, version: "2017-07-21" });
	}
}

// tslint:disable:object-literal-sort-keys
// tslint:disable-next-line:no-unused-expression
yargs
	.command({
		command: "set <variable> <value>",
		builder: (args: yargs.Argv): yargs.Argv => args,
		describe: "store a variable e.g. 'api-key' or 'api-secret'",
		handler: (args: any): void => handleCommandResult(cmdSet(args, cfgMgr))
	})
	.command({
		command: "unset <variable>",
		describe: "remove a variable e.g. 'api-key' or 'api-secret'",
		builder: (args: yargs.Argv): yargs.Argv => args,
		handler: (args: any): void => handleCommandResult(cmdUnset(args, cfgMgr))
	})
	.command({
		command: "get <variable>",
		describe: "retrieve the value of a variable e.g. 'api-key' or 'api-secret'",
		builder: (args: yargs.Argv): yargs.Argv => args,
		handler: (args: any): void => handleCommandResult(cmdGet(args, output, cfgMgr))
	})
	.command({
		command: "sellprice <currency1> <currency2>",
		describe: "get the current sell price for selling currency1 for currency2 e.g. sellprice BTC EUR",
		builder: (args: yargs.Argv): yargs.Argv => args
			.boolean("mock")
			.describe("mock", "use fake Coinbase API to try things out with"),
		handler: (args: any): void => handleCommandResult(
			(async (): Promise<void> => {
				const config = await cfgMgr.load();
				const client = await ensureClient(args, config, output);
				await cmdSellPrice(args, output, client);
			})()
		)
	})
	.command({
		command: "sell",
		describe: "sell a cryptocurrency",
		builder: (args: yargs.Argv): yargs.Argv => args
			.boolean("mock")
			.describe("mock", "use fake Coinbase API to try things out with")
			.string("account")
			.alias("a", "account")
			.describe("account", "id of account to sell from")
			.string("payment-method")
			.alias("p", "payment-method")
			.describe("payment-method", "id of payment-method to sell from")
			.string("amount")
			.alias("t", "amount")
			.describe("amount", "amount of coins to sell, or 'all' for all coins")
			.boolean("quote")
			.describe("quote", "only request a quote, not a real sell order")
			.boolean("commit")
			.describe("commit", "immediately commit the order"),
		handler: (args: any): void => handleCommandResult(
			(async (): Promise<void> => {
				const config = await cfgMgr.load();
				const client = await ensureClient(args, config, output);
				await cmdSell(args, output, client);
			})()
		)
	})
	.command({
		command: "$0",
		describe: "default action",
		builder: (args: yargs.Argv): yargs.Argv => args,
		handler: () => output.log("This is a tool for trading on Coinbase on the command-line. Use 'coinbase help' to learn more.")
	})
	.help(true)
	.argv;
// tslint:enable:object-literal-sort-keys
