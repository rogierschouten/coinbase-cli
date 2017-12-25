/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import "./common-init";

import { expect } from "chai";

import { cmdSellPrice } from "../lib/cli-get-info";
import { ClientMock } from "../lib/coinbase-mock";

import { ConsoleOutputMock } from "./console-output-mock";
import { fakeTime, restoreTime, runPromise, SinonFakeTimers } from "./sinon-utils";

describe("cmdSellPrice()", (): void => {

	let client: ClientMock;
	let output: ConsoleOutputMock;
	let clock: SinonFakeTimers;

	beforeEach((): void => {
		clock = fakeTime();
		client = new ClientMock();
		output = new ConsoleOutputMock();
	});

	afterEach((): void => {
		restoreTime(clock);
	});

	it("should output the price", (): void => {
		runPromise(clock, cmdSellPrice({ currency1: "BTC", currency2: "EUR" }, output, client));
		expect(output.errors.length).to.equal(0);
		expect(output.logs).to.deep.equal(["1 BTC = 15234.23 EUR"]);
	});
});
