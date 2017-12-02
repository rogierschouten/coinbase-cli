/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */
import * as assert from "assert";
import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";
import * as util from "util";

import { output } from "./output";

/**
 * Configuration as read from file
 */
export interface Configuration {
	variables: {
		apiKey?: string;
		apiSecret?: string;
	};
}

// default configuration file path
const CONFIG_PATH = path.join(os.homedir(), ".coinbase-cli.json");

// configuration as read from disk
export let CONFIG: Configuration;

// read configuration synchronously, otherwise yargs cannot use it
try {
	CONFIG = JSON.parse(fse.readFileSync(CONFIG_PATH, { encoding: "utf8" }));
	validateConfig(CONFIG);
} catch (error) {
	CONFIG = {
		variables: {}
	};
}

/**
 * Returns a clone of the current configuration
 */
export function cloneConfig(): Configuration {
	return {
		...CONFIG,
		variables: {
			...CONFIG.variables
		}
	};
}

/**
 * Update the current configuration and write it to disk
 */
export async function writeConfiguration(config: Configuration): Promise<void> {
	validateConfig(config);
	CONFIG = config;
	const json = JSON.stringify(config, undefined, 2);
	try {
		await fse.writeFile(CONFIG_PATH, json, { encoding: "utf8" });
	} catch (error) {
		throw new Error(util.format("error writing configuration file '%s': %s", CONFIG_PATH, error.message));
	}
}

/**
 * Throws if `config` is not valid
 */
export function validateConfig(config: Configuration): void {
	assert(config.variables, "missing 'variables' property");
	assert(typeof config.variables === "object", "'variables' property should be an object");
	assert(typeof config.variables.apiKey === "string" || config.variables.apiKey === undefined, "'apiKey' variable should be a string");
	assert(
		typeof config.variables.apiSecret === "string" || config.variables.apiSecret === undefined,
		"'apiSecret' variable should be a string"
	);
}

/**
 * Command-line command to print the value of a variable on the command-line
 * @param args
 */
export async function cmdGet(args: { variable: string; value: string; }): Promise<void> {
	switch (args.variable) {
		case "api-key": output.log(CONFIG.variables.apiKey); break;
		case "api-secret": output.log(CONFIG.variables.apiSecret); break;
		default: throw new Error(util.format("unknown variable '%s'", args.variable));
	}
}

/**
 * Command-line command to set variables
 * @param args
 */
export async function cmdSet(args: { variable: string; value: string; }): Promise<void> {
	const config: Configuration = cloneConfig();
	switch (args.variable) {
		case "api-key": config.variables.apiKey = args.value; break;
		case "api-secret": config.variables.apiSecret = args.value; break;
		default: throw new Error(util.format("unknown variable '%s'", args.variable));
	}
	await writeConfiguration(config);
}

/**
 * Command-line command to remove variables
 * @param args
 */
export async function cmdUnSet(args: { variable: string; }): Promise<void> {
	const config: Configuration = cloneConfig();
	switch (args.variable) {
		case "api-key": delete config.variables.apiKey; break;
		case "api-secret": delete config.variables.apiSecret; break;
		default: throw new Error(util.format("unknown variable '%s'", args.variable));
	}
	await writeConfiguration(config);
}
