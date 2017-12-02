/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */
import * as yargs from "yargs";

import { cmdAccounts } from "./accounts";
import { cmdGet, cmdSet, cmdUnSet } from "./config";
import { output } from "./output";

/**
 * Provides basic error handling around each command implementation
 * @param handler command handler
 */
function wrapCmd(handler: (args: any) => Promise<void>): (args: yargs.Arguments) => void {
	return (args: yargs.Arguments): void => {
		handler(args)
			.then(() => {
				process.exit(0);
			})
			.catch((error: Error): void => {
				output.error(error.message);
				process.exit(1);
			});
	};
}

// tslint:disable:object-literal-sort-keys
// tslint:disable-next-line:no-unused-expression
yargs
	.command({
		command: "set <variable> <value>",
		builder: (args: yargs.Argv): yargs.Argv => args,
		describe: "store a variable e.g. 'api-key' or 'api-secret'",
		handler: wrapCmd(cmdSet)
	})
	.command({
		command: "unset <variable>",
		describe: "remove a variable e.g. 'api-key' or 'api-secret'",
		builder: (args: yargs.Argv): yargs.Argv => args,
		handler: wrapCmd(cmdUnSet)
	})
	.command({
		command: "get <variable>",
		describe: "retrieve the value of a variable e.g. 'api-key' or 'api-secret'",
		builder: (args: yargs.Argv): yargs.Argv => args,
		handler: wrapCmd(cmdGet)
	})
	.command({
		command: "accounts",
		describe: "list all accounts",
		builder: (args: yargs.Argv): yargs.Argv => args,
		handler: wrapCmd(cmdAccounts)
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
