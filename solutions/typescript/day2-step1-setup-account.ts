// ============================================================
// Day 2 - Step 1 Solution: Setup Account (Enable Default Ripple)
// Learn: How to configure account flags on the XRP Ledger.
// Default Ripple is required before issuing tokens.
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

  const client: xrpl.Client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log('Connected to XRPL Testnet');

  const accountSetTx: xrpl.AccountSet = {
    TransactionType: 'AccountSet',
    Account: issuerWallet.address,
    SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
  };
  const result = await client.submitAndWait(accountSetTx, { wallet: issuerWallet });
  console.log(result);

  console.log('Default Ripple enabled on issuer account!');
  console.log(`\nExplorer: https://testnet.xrpl.org/accounts/${issuerWallet.address}`);
  await client.disconnect();
}

main().catch(console.error);
