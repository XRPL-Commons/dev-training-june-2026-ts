// ============================================================
// Day 2 - Step 2 Solution: Issue a Custom Token
// Learn: How to create a trust line and issue tokens on XRPL.
// The holder must trust the issuer before receiving tokens.
// ============================================================

import * as xrpl from 'xrpl';
import * as fs from 'fs';

const TESTNET_URL: string = 'wss://s.altnet.rippletest.net:51233';

interface WalletData {
  address: string;
  seed: string;
}

interface WalletsFile {
  wallets: WalletData[];
}

async function main(): Promise<void> {
  const { wallets }: WalletsFile = JSON.parse(fs.readFileSync('../../wallets.json', 'utf-8'));
  const issuerWallet: xrpl.Wallet = xrpl.Wallet.fromSeed(wallets[0].seed);
  const holderWallet: xrpl.Wallet = xrpl.Wallet.fromSeed(wallets[1].seed);

  const currencyCode: string = 'ACD';

  const client: xrpl.Client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Create trust line
  const trustSetTx: xrpl.TrustSet = {
    TransactionType: 'TrustSet',
    Account: holderWallet.address,
    LimitAmount: {
      currency: currencyCode,
      issuer: issuerWallet.address,
      value: '1000000',
    },
  };
  const trustResult = await client.submitAndWait(trustSetTx, { wallet: holderWallet });
  console.log('Trust line created!', trustResult.result.hash);

  // Issue tokens
  const paymentTx: xrpl.Payment = {
    TransactionType: 'Payment',
    Account: issuerWallet.address,
    Destination: holderWallet.address,
    Amount: {
      currency: currencyCode,
      issuer: issuerWallet.address,
      value: '500',
    },
  };
  const payResult = await client.submitAndWait(paymentTx, { wallet: issuerWallet });
  console.log('Tokens issued!', payResult.result.hash);

  console.log(`\nExplorer: https://testnet.xrpl.org/accounts/${issuerWallet.address}`);
  await client.disconnect();
}

main().catch(console.error);
