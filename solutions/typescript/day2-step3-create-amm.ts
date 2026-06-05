// ============================================================
// Day 2 - Step 3 Solution: Create an AMM Pool
// Learn: How to create an Automated Market Maker (AMM) pool
// that pairs your custom token with XRP.
//
// PREREQUISITE: Run step1 (Default Ripple) and step2 (issue
// tokens) first! The issuer needs tokens to deposit into the pool.
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

  const currencyCode: string = 'ACD';

  const client: xrpl.Client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Create AMM
  const ammCreateTx: xrpl.AMMCreate = {
    TransactionType: 'AMMCreate',
    Account: issuerWallet.address,
    Amount: {
      currency: currencyCode,
      issuer: issuerWallet.address,
      value: '100',
    },
    Amount2: xrpl.xrpToDrops('10'),
    TradingFee: 500,
  };
  const result = await client.submitAndWait(ammCreateTx, { wallet: issuerWallet });
  console.log('AMM Pool created!', result.result.hash);

  // Query AMM info
  const ammInfo = await client.request({
    command: 'amm_info',
    asset: {
      currency: currencyCode,
      issuer: issuerWallet.address,
    },
    asset2: { currency: 'XRP' },
  });
  console.log(JSON.stringify(ammInfo.result, null, 2));

  console.log(`\nExplorer: https://testnet.xrpl.org/accounts/${issuerWallet.address}`);
  await client.disconnect();
}

main().catch(console.error);
