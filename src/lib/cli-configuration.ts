/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import * as util from "util";

import { cloneConfiguration, Configuration, ConfigurationMgr } from "./configuration";
import { ConsoleOutput } from "./console-output";

/**
 * Command-line command to print the value of a variable on the command-line
 * @param args
 */
export async function cmdGet(args: { variable: string; value: string; }, output: ConsoleOutput, cfgMgr: ConfigurationMgr): Promise<void> {
	const config = await cfgMgr.load();
	switch (args.variable) {
		case "api-key": output.log(config.variables.apiKey); break;
		case "api-secret": output.log(config.variables.apiSecret); break;
		case "api-version": output.log(config.variables.apiVersion); break;
		default: throw new Error(util.format("unknown variable '%s'", args.variable));
	}
}

/**
 * Command-line command to set variables
 * @param args
 */
export async function cmdSet(args: { variable: string; value: string; }, cfgMgr: ConfigurationMgr): Promise<void> {
	const config: Configuration = cloneConfiguration(await cfgMgr.load());
	switch (args.variable) {
		case "api-key": config.variables.apiKey = args.value; break;
		case "api-secret": config.variables.apiSecret = args.value; break;
		case "api-version": config.variables.apiVersion = args.value; break;
		default: throw new Error(util.format("unknown variable '%s'", args.variable));
	}
	await cfgMgr.save(config);
}

/**
 * Command-line command to remove variables
 * @param args
 */
export async function cmdUnset(args: { variable: string; }, cfgMgr: ConfigurationMgr): Promise<void> {
	const config: Configuration = cloneConfiguration(await cfgMgr.load());
	switch (args.variable) {
		case "api-key": delete config.variables.apiKey; break;
		case "api-secret": delete config.variables.apiSecret; break;
		case "api-version": delete config.variables.apiVersion; break;
		default: throw new Error(util.format("unknown variable '%s'", args.variable));
	}
	await cfgMgr.save(config);
}
