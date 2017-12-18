// /**
//  * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
//  */
// import * as coinbase from "coinbase";
// import { terminal } from "terminal-kit";
// import * as util from "util";

// import { CONFIG } from "./config";
// import { defer } from "./promises";

// /**
//  * Command-line command to list all accounts
//  * @param args
//  */
// export async function cmdAccounts(_args: {}): Promise<void> {
// 	if (!CONFIG.variables.apiKey) {
// 		throw new Error("There is no API key configured yet. Please set an API key using 'coinbase set api-key <my key from coinbase.com>'");
// 	}
// 	if (!CONFIG.variables.apiSecret) {
// 		throw new Error(
// 			"There is no API secret configured yet. Please set an API secret using 'coinbase set api-secret <my secret from coinbase.com>'"
// 		);
// 	}
// 	const client = new coinbase.Client({
// 		apiKey: CONFIG.variables.apiKey,
// 		apiSecret: CONFIG.variables.apiSecret,
// 		version: "2017-08-07"
// 	});
// 	const deferred = defer();
// 	client.getAccounts({}, (error: Error, result: coinbase.Account[]): void => {
// 		if (error) {
// 			deferred.reject(error);
// 			return;
// 		}
// 		for (const account of result) {
// 			terminal.bgGreen.red(
// 				util.format("Name: %s, id: %s, balance: %s %s\n", account.name, account.id, account.balance.amount, account.balance.currency)
// 			);
// 		}
// 		deferred.resolve();
// 	});
// 	return deferred.promise;
// }
