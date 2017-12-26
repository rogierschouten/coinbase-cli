/**
 * Copyright (c) 2017 Rogier Schouten <https://github.com/rogierschouten>
 */

import "./common-init";

import { expect } from "chai";

import { cmdAccounts, cmdBuyPrice, cmdPaymentMethods, cmdSellPrice, cmdSpotPrice } from "../lib/cli-get-info";
import { ClientMock } from "../lib/coinbase-mock";

import { ConsoleOutputMock } from "./console-output-mock";
import { fakeTime, restoreTime, runPromise, SinonFakeTimers } from "./sinon-utils";

describe("info commands", (): void => {
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

	describe("cmdAccounts()", (): void => {
		it("should output the available accounts", (): void => {
			runPromise(clock, cmdAccounts(output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal([
				"name: BTC Wallet, id: 33452906-0ab7-596a-98bd-cb3b62806ebe, balance: 0.00000000 BTC, type: wallet",
				"name: ETH Wallet, id: ea81d255-a43d-53f7-8379-08a2f96d0034, balance: 0.00000000 ETH, type: wallet",
				"name: EUR Wallet, id: db7abb63-2e8b-534a-bdff-5d1dbf2234f2, balance: 172.83 EUR, type: fiat",
				"name: LTC Wallet, id: a3b02e94-73f8-557a-a553-4e0ad5abbbb3a2, balance: 0.94940530 LTC, type: wallet"
			]);
		});
		it("should inform the user if no accounts available", (): void => {
			client._accounts = [];
			runPromise(clock, cmdAccounts(output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal([
				"no accounts available"
			]);
		});
	});

	describe("cmdPaymentMethods()", (): void => {
		it("should output the available payment methods", (): void => {
			runPromise(clock, cmdPaymentMethods(output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal([
				"name: ABN AMRO (NL84 ABNA 0933 5493 22), id b378cf67-a6bd-5f84-bcb4-5c29682d186d, type: sepa_bank_account, currency: EUR",
				"name: EUR Wallet, id 453ebbdf-9d09-578f-8fec-ecfd7e7fed17, type: fiat_account, currency: EUR"
			]);
		});
		it("should inform the user if no payment methods available", (): void => {
			client._paymentMethods = [];
			runPromise(clock, cmdPaymentMethods(output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal([
				"no payment methods available"
			]);
		});
	});

	describe("cmdBuyPrice()", (): void => {
		it("should output the price", (): void => {
			runPromise(clock, cmdBuyPrice({ currency1: "BTC", currency2: "EUR" }, output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal(["buy: 1 BTC = 15235.00 EUR"]);
		});
	});

	describe("cmdSellPrice()", (): void => {
		it("should output the price", (): void => {
			runPromise(clock, cmdSellPrice({ currency1: "BTC", currency2: "EUR" }, output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal(["sell: 1 BTC = 15234.00 EUR"]);
		});
	});

	describe("cmdSpotPrice()", (): void => {
		it("should output the price", (): void => {
			runPromise(clock, cmdSpotPrice({ currency1: "BTC", currency2: "EUR" }, output, client));
			expect(output.errors.length).to.equal(0);
			expect(output.logs).to.deep.equal(["spot: 1 BTC = 15234.50 EUR"]);
		});
	});
});
