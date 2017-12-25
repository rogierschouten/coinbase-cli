/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

/**
 * Configuration as read from file
 */
export interface Configuration {
	variables: {
		apiKey?: string;
		apiSecret?: string;
		apiVersion?: string;
	};
}

export interface ConfigurationMgr {
	/**
	 * Load the configuration, on error returns default configuration
	 * @throws nothing
	 */
	load(): Promise<Configuration>;
	/**
	 * Validate and save the configuration, on error returns default configuration
	 * @throws when configuration invalid
	 * @throws when saving fails
	 */
	save(configuration: Configuration): Promise<void>;
}

/**
 * Returns a clone of the current configuration
 * @throws nothing returns default empty configuration on error
 */
export function cloneConfiguration(configuration: Configuration): Configuration {
	return {
		...configuration,
		variables: {
			...configuration.variables
		}
	};
}
