# Minecraft

## Getting Started

You first, encode the text dump of eth addresses in `accounts.txt`

```bash
node encode /path/to/accounts.txt accounts.bin
```

Then you can start the dapp

```bash
yarn start
```

If you visit in your browser, you'll see a hotpink loading bar. That is index.js requesting the account address binary and parsing it into ETH address strings.

That's all I got for now.

