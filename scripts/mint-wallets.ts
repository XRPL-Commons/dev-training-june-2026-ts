/**
 * XRPL Academy - Wallet Minting Script (TypeScript)
 *
 * This script creates two funded wallets on the XRPL Testnet using the Testnet Faucet.
 *
 * How it works:
 * 1. Connects to the XRPL Testnet via WebSocket
 * 2. Calls the faucet API (client.fundWallet) which:
 *    - Generates a new cryptographic key pair (public key + private key)
 *    - Derives an XRPL address from the public key
 *    - Sends enough XRP to activate the account (meet the reserve requirement)
 * 3. Saves wallet details to wallets.json for use in exercises
 *
 * XRPL Concepts:
 * - Every XRPL account needs a minimum "reserve" of 10 XRP to exist on the ledger
 * - The Testnet Faucet provides free test XRP (no real value)
 * - A "seed" is the secret key that controls the account -- never share it on Mainnet
 * - An "address" is the public identifier (starts with "r") -- safe to share
 *
 * Run: npx ts-node scripts/mint-wallets.ts
 */

import * as xrpl from 'xrpl';
import * as fs from 'fs';
import * as path from 'path';

const TESTNET_URL: string = 'wss://s.altnet.rippletest.net:51233';

interface WalletData {
  label: string;
  address: string;
  seed: string | undefined;
  publicKey: string;
  privateKey: string | undefined;
  balance: string;
  network: string;
  explorer: string;
}

interface WalletsOutput {
  generated_at: string;
  network: string;
  note: string;
  wallets: WalletData[];
}

async function mintWallets(): Promise<void> {
  // Create a client instance. XRPL communication happens over WebSocket,
  // which maintains a persistent connection for real-time ledger updates.
  const client: xrpl.Client = new xrpl.Client(TESTNET_URL);

  try {
    await client.connect();
    console.log('Connected to XRPL Testnet');
    console.log('Network: ' + TESTNET_URL);
    console.log('');

    const wallets: WalletData[] = [];

    for (let i = 1; i <= 2; i++) {
      console.log('Minting Wallet ' + i + '...');

      // fundWallet() calls the Testnet Faucet API, which:
      // - Generates a new key pair
      // - Creates the account on the ledger with a starting balance
      const { wallet, balance } = await client.fundWallet();

      const walletData: WalletData = {
        label: 'Wallet ' + i,
        address: wallet.address,
        seed: wallet.seed,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        balance: balance + ' XRP (Testnet)',
        network: 'Testnet',
        explorer: 'https://testnet.xrpl.org/accounts/' + wallet.address,
      };

      wallets.push(walletData);

      console.log('  Address : ' + wallet.address);
      console.log('  Seed    : ' + wallet.seed);
      console.log('  Balance : ' + balance + ' XRP (Testnet)');
      console.log('  Explorer: https://testnet.xrpl.org/accounts/' + wallet.address);
      console.log('');
    }

    // Save wallets to a JSON file so the exercise scripts can load them
    const output: WalletsOutput = {
      generated_at: new Date().toISOString(),
      network: 'Testnet',
      note: 'These wallets contain test XRP only. Never reuse Testnet seeds on Mainnet.',
      wallets: wallets,
    };

    fs.writeFileSync(
      path.join(__dirname, '..', 'wallets.json'),
      JSON.stringify(output, null, 2)
    );

    console.log('Wallets saved to wallets.json');
    console.log('IMPORTANT: Keep seeds private. Never use Testnet seeds on Mainnet.');

  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error minting wallets: ' + error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('  - The Testnet faucet may be temporarily down. Wait and retry.');
    console.log('  - Check your internet connection.');
    console.log('  - Manual faucet: https://faucet.altnet.rippletest.net/accounts');
  } finally {
    await client.disconnect();
  }
}

mintWallets();
