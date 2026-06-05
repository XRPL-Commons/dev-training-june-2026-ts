// ============================================================
// Homework Exercise: NFT Lifecycle
// Learn: How to mint, query, and burn NFTs on the XRP Ledger.
// You'll experience the full lifecycle of an NFToken.
// Reference materials:
// - https://learn.xrpl-commons.org/course/code-with-the-xrpl/lesson/mint-and-burn-nfts/
// - https://xrpl.org/docs/references/protocol/transactions/types/nftokenmint
// - https://xrpl.org/docs/references/protocol/transactions/types/nftokenburn
// - https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_nfts
// - https://js.xrpl.org/
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
  const wallet: xrpl.Wallet = xrpl.Wallet.fromSeed(wallets[0].seed);

  const client: xrpl.Client = new xrpl.Client(TESTNET_URL);
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║ TODO 1: Mint an NFT                                             ║
  // ║                                                                  ║
  // ║ HINT: const mintTx: xrpl.NFTokenMint = {                        ║
  // ║   TransactionType: 'NFTokenMint',                                ║
  // ║   Account: wallet.address,                                       ║
  // ║   NFTokenTaxon: 0,                                               ║
  // ║   Flags: 8,                                                      ║
  // ║   TransferFee: 5000,                                             ║
  // ║   URI: xrpl.convertStringToHex('ipfs://YOUR_NAME_HERE')          ║
  // ║ }                                                                ║
  // ║ const mintResult = await client.submitAndWait(mintTx, { wallet })║
  // ╚══════════════════════════════════════════════════════════════════╝
  // YOUR CODE HERE

  console.log('NFT Minted!');

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║ TODO 2: Get account NFTs and extract the NFTokenID              ║
  // ║                                                                  ║
  // ║ HINT: const nfts = await client.request({                        ║
  // ║         command: 'account_nfts',                                  ║
  // ║         account: wallet.address                                   ║
  // ║       });                                                         ║
  // ║       const tokenId = nfts.result.account_nfts[0].NFTokenID;      ║
  // ╚══════════════════════════════════════════════════════════════════╝
  // YOUR CODE HERE
  const tokenId: string = ''; // replace with the actual NFTokenID from above

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║ TODO 3: Burn the NFT                                            ║
  // ║                                                                  ║
  // ║ HINT: const burnTx: xrpl.NFTokenBurn = {                        ║
  // ║   TransactionType: 'NFTokenBurn',                                ║
  // ║   Account: wallet.address,                                       ║
  // ║   NFTokenID: tokenId                                              ║
  // ║ }                                                                ║
  // ║ const burnResult = await client.submitAndWait(burnTx, { wallet })║
  // ╚══════════════════════════════════════════════════════════════════╝
  // YOUR CODE HERE

  console.log('NFT Burned!');

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║ TODO 4: Query account_nfts again to verify it's gone            ║
  // ║                                                                  ║
  // ║ HINT: Same request as TODO 2, then log the count                 ║
  // ╚══════════════════════════════════════════════════════════════════╝
  // YOUR CODE HERE

  console.log(`\nExplorer: https://testnet.xrpl.org/accounts/${wallet.address}`);
  await client.disconnect();
}

main().catch(console.error);
