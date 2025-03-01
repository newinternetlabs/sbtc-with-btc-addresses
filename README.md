# Sending sBTC with BTC addresses

This application demonstrates sending sBTC (Stacks Bitcoin) to a native Segwit Bitcoin address. It provides a simple interface with two wallet instances, allowing users to experience how sBTC transactions can work with Bitcoin addresses.


## Warning

**This is a demonstration application only.**

- It is offerred AS IS subject only to the terms LICENSE.
- Entering a Bitcoin address generated outside of this app will cause your sBTC to be lost unless you have the private key and technical knowledge to recover it.
- Sending layer 1 Bitcoin to an address generated in this app will cause your BTC to be lost unless you have the private key and technical knowledge to recover it.
- Neither New Internet Labs Limited nor anyone else will provide assistance recovering lost sBTC, STX, BTC, or other tokens.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open Chrome to `http://localhost:5173`

## Usage

1. Install a compatible Stacks wallet extension. Xverse and Leather have been tested.
2. Before you visit this app make sure at least one of your Stacks accounts has sBTC and STX in it.
3. Visit the app (hosted version here: https://sbtc-with-btc-addresses.vercel.app/)
4. Accept the disclaimer when prompted.
5. Connect wallet instance 1 with the Stacks account that has sBTC and STX.
6. Connect wallet instance 2 with another Stacks account
7. Experiment with sending sBTC from wallet instance 1 to 2 using the bitcoin addresses in the app.

## License

MIT License - Copyright (c) 2025 New Internet Labs Limited
