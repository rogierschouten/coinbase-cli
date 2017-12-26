# coinbase-cli

This is a command-line utility that uses the Coinbase API to trade, deposit and withdraw cryptocurrencies.

On busy days, it has happened that the Coinbase website was down while its underlying API services still worked. This command-line tool
is my emergency backup, so that I can trade when everyone else is. Of course, there are many other use cases for a command-line tool such as
easily automating trading tasks or inspecting the prices.

## Features

I'm still working on this project. At this time, bying and selling coins is supported.

* Interactive mode: commands will nicely ask you to input them during command execution
* Non-interactive mode: specify all arguments on the command-line
* Commands (run `coinbase help <command>` for details):
	* `accounts`: list your coinbase accounts
	* `paymentmethods`: list your coinbase payment methods
	* `buyprice`: shows the buy price for a given trade pair
	* `sellprice`: shows the sell price for a given trade pair
	* `spotprice`: shows the spot price for a given trade pair
	* `buy`: buy crypto currency with fiat currency
	* `sell`: sell crypto currency for fiat currency

## Installation & Preparation

* Install [Node.JS](https://nodejs.org)
* Install coinbase-cli by running `npm install -g coinbase-cli`
* Get your API key and API secret from the [Coinbase](https://coinbase.com) website
	* Go to Settings - API access and click the 'New API Key' button
	* Ensure you set enough permissions on your key to do what you want to do with the coinbase CLI tool.

Optionally, you can have the CLI tool remember your API key and secret. They will be stored (un-encrypted) in a `coinbase.json` file in your home directory.
If you skip this step, you will have to enter the keys with every command, or pass them on the command-line with every command.

```shell
coinbase set api-key "<YOUR_API_KEY>"
coinbase set api-secret "<YOUR_API_SECRET>"
```

## Use

### Getting Help

First of all, detailed instructions can be found by executing:

```shell
coinbase help
coinbase <command> help
```

### Interactive and Non-interactive mode

For most commands, the tool has two modes: interactive and non-interactive. In interactive mode, you don't provide any command-line arguments except the command you would like to run. The tool then asks you questions on the information it needs.

To use interactive mode, simply type `coinbase <command>` e.g.:

```shell
$ coinbase sell

Please choose an account by typing in its number:
1:   name: BTC Wallet, id: 33452906-0ab7-596a-98bd-5923059312065, balance: 3.40000000 BTC, type: wallet
2:   name: LTC Wallet, id: a3b02e94-73f8-557a-a553-5329056236542, balance: 0.94940530 LTC, type: wallet
>2

Please choose a payment method by typing in its number:
1:   name: USD Wallet, id 453ebbdf-9d09-578f-8fec-532532634156, type: fiat_account, currency: USD
2:   name: EUR Wallet, id 453ebbdf-9d09-578f-8fec-ecfd7e7fed17, type: fiat_account, currency: EUR
>2

Please enter the amount e.g. '30.5', or 'all' to sell all your LTC:
?all

Sell Order:
- amount   : 0.94940530 LTC
- fee      : 4.07 EUR
- subtotal : 273.08 EUR
- total    : 269.01 EUR
- status   : created

> Commit
 Cancel
Done!
```

Press `ESC` to cancel while the tool is asking for input. If there is only one option for a choice (e.g. you only have one wallet with a non-zero balance), then the tool won't ask you to choose, it will tell you what the value is.

The other option is to pass all necessary information on the command-line:

```shell
coinbase sell --account="a3b02e94-73f8-557a-a553-5329056236542" --payment-method="453ebbdf-9d09-578f-8fec-ecfd7e7fed17" --amount="all"
```

## Disclaimer

Use this tool at your own risk. The code may contain bugs - it's open source so you can check it before you use it.

## License

License: MIT, see LICENSE file.

## Donations

* Bitcoin: 1FytkRspy78HGBJgsieCqgNapxsKSSG6bU
* Bitcoin Cash: 1DQzYgh6r2R5PvJTckLGdBqqFhKjsmEpAb
* Dash: XnrCJYkvipLUemUH7VmzpD6vvoQoVj4cVD
* Ethereum: 0xe324D345857c8802d34c4577fB465E050Cf10771
* Litecoin: La72oJGP4fZR4wUGaHL4WKN2NE5g8uuiUS

