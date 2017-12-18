/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import * as assert from "assert";
import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";
import * as util from "util";

import { Configuration, ConfigurationMgr } from "./configuration";
export { Configuration, ConfigurationMgr, cloneConfiguration } from "./configuration";

// default configuration file path
const CONFIG_PATH = path.join(os.homedir(), ".coinbase-cli.json");

export class ConfigurationMgrImpl implements ConfigurationMgr {
	/**
	 * Cached configuration
	 */
	private _config: Promise<Configuration> | undefined;

	/**
	 * @inheritDoc
	 */
	public async load(): Promise<Configuration> {
		if (!this._config) {
			this._config = fse.readFile(CONFIG_PATH, { encoding: "utf8" })
				.then((content: string): Configuration => {
					const result = JSON.parse(content);
					this._validate(result);
					return result;
				})
				.catch((): Configuration => {
					return { variables: {} };
				});
		}
		return this._config;
	}

	/**
	 * @inheritDoc
	 */
	public async save(configuration: Configuration): Promise<void> {
		this._validate(configuration);
		this._config = Promise.resolve(configuration);
		const json = JSON.stringify(configuration, undefined, 2);
		try {
			await fse.writeFile(CONFIG_PATH, json, { encoding: "utf8" });
		} catch (error) {
			throw new Error(util.format("error writing configuration file '%s': %s", CONFIG_PATH, error.message));
		}
	}

	/**
	 * Validate given configuration
	 * @throws on validation errors
	 */
	private _validate(config: Configuration): void {
		assert(config.variables, "missing 'variables' property");
		assert(typeof config.variables === "object", "'variables' property should be an object");
		assert(typeof config.variables.apiKey === "string" || config.variables.apiKey === undefined, "'apiKey' variable should be a string");
		assert(
			typeof config.variables.apiSecret === "string" || config.variables.apiSecret === undefined,
			"'apiSecret' variable should be a string"
		);
	}
}
