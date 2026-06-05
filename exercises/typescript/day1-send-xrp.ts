// ============================================================
// Day 1 Exercise: Send XRP
// Learn: How to construct and submit a Payment transaction
// on the XRP Ledger testnet using TypeScript.
// Reference materials:
// - https://learn.xrpl-commons.org/course/blockchain-foundations-for-web2-developers/lesson/create-accounts-and-send-xrp/
// - https://xrpl.org/docs/references/protocol/transactions/types/payment
// - https://js.xrpl.org/
// ============================================================

import * as xrpl from 'xrpl';
import * as fs from 'fs';

const TESTNET_URL: string = 'wss://s.altnet.rippletest.net:51233';

interface WalletData {
  label: string;
  address: string;
  seed: string;
  publicKey: string;
  privateKey: string;
  balance: string;
  network: string;
  explorer: string;
}

interface WalletsFile {
  wallets: WalletData[];
}

async function main(): Promise<void> {
  const { wallets }: WalletsFile = JSON.parse(fs.readFileSync('../../wallets.json', 'utf-8'));
  const senderWallet: xrpl.Wallet = xrpl.Wallet.fromSeed(wallets[0].seed);
  const receiverWallet: xrpl.Wallet = xrpl.Wallet.fromSeed(wallets[1].seed);

  const client: xrpl.Client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Check balance before
  const balanceBefore: string = await client.getXrpBalance(receiverWallet.address);
  console.log(`Receiver balance before: ${balanceBefore} XRP`);

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║ TODO 1: Construct the Payment transaction object                ║
  // ║                                                                  ║
  // ║ HINT: const paymentTx: xrpl.Payment = {                         ║
  // ║   TransactionType: 'Payment',                                    ║
  // ║   Account: senderWallet.address,                                 ║
  // ║   Amount: xrpl.xrpToDrops('10'),                                 ║
  // ║   Destination: receiverWallet.address                             ║
  // ║ }                                                                ║
  // ╚══════════════════════════════════════════════════════════════════╝
  const paymentTx: xrpl.Payment = {
    TransactionType: 'Payment',
    Account: senderWallet.address,
    // YOUR CODE HERE — fill in Amount and Destination
    Amount: '',
    Destination: '',
  };

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║ TODO 2: Submit the transaction and log the result               ║
  // ║                                                                  ║
  // ║ HINT: const result = await client.submitAndWait(paymentTx,       ║
  // ║         { wallet: senderWallet });                                ║
  // ║       console.log(result);                                        ║
  // ╚══════════════════════════════════════════════════════════════════╝
  // YOUR CODE HERE

  // Check balance after
  const balanceAfter: string = await client.getXrpBalance(receiverWallet.address);
  console.log(`Receiver balance after: ${balanceAfter} XRP`);

  console.log(`\nExplorer: https://testnet.xrpl.org/accounts/${senderWallet.address}`);
  await client.disconnect();
}

main().catch(console.error);
