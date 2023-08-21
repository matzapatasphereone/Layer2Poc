#!/usr/bin/env ts-node-script
import { Command } from 'commander';
import { getUsdcBalance } from './layer2/balances';
import { authenticate } from './layer2/authentication';
import { createDepositAccount, getAccountDetails, supportedAssets } from './layer2/accounts';
import { getDepositInstructions } from './layer2/deposits';
import { exchangeAssets } from './layer2/exchange';
import { acceptWithdrawal, createCryptoWithdrawal } from './layer2/withdrawal';
import { createCryptoCounterparty, getCounterparties } from './layer2/counterparties';
import yesno from 'yesno';

const program = new Command();

program
  .name('Layer2')
  .description('A simple CLI for Layer2')
  .version('0.8.0');

program
  .command('account')
  .description('get available accounts and balances')
  .argument('<string>', 'user id (DANIELLEE002 for sandbox)')
  .option('--create-fiat', 'creates fiat account for the user')
  .option('--create-crypto', 'creates usdc account for the user')
  .action(async (userId, options) => {
    const accessToken = await authenticate();

    if (options.createFiat)
      await createDepositAccount(userId, "USD", accessToken)
    if (options.createCrypto)
      await createDepositAccount(userId, "USDC", accessToken)


    // In the end we always get the account details
    const accounts = await getAccountDetails(userId, accessToken);
    console.log("Accounts for user", userId);
    console.log(accounts);
  });

program
  .command('onramp')
  .description('buy USDC with USD')
  .argument('<string>', 'user id (DANIELLEE002 for sandbox)')
  .requiredOption('-a, --amount <amount>', 'amount of USD to buy USDC with')
  .option("-wc, --withdrawal-counterpart <id>", "withdrawal counterpart id")
  .action(async (userId, options) => {
    if (!supportedAssets.includes(options.asset)) return console.error("Invalid asset");

    // Authenticate
    const accessToken = await authenticate();

    // check for account and create if not exists
    await createDepositAccount(userId, "USD", accessToken)

    // get deposit instructions
    const instructions = await getDepositInstructions(userId, "USD", accessToken);
    console.log("Deposit instructions:", instructions);
    console.log("In sandbox copy memo id and use it in `create manual deposit` in the dashboard")
    for (const instruction of instructions.deposit_source.deposit_instructions) {
      console.log(" - ", instruction)
    }
    const ok = await yesno({ question: "Have you deposited?" });
    if (!ok) return console.log("Aborting...");

    // buy crypto
    const prevUsdcBalance = (await getUsdcBalance(userId, accessToken)).available_balance;
    await exchangeAssets(userId, "USD", "USDC", Number(options.amount), accessToken);

    // Wait for the transaction to complete
    for (let i = 0; i < 10; i++) {
      const usdcBalance = (await getUsdcBalance(userId, accessToken)).available_balance;
      if ((prevUsdcBalance + options.amount) <= usdcBalance) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Withdraw crypto
    if (!options.withdrawalCounterpart) return console.log("No withdrawal counterpart specified");
    const withdrawalId = await createCryptoWithdrawal(userId, Number(options.amount), options.withdrawalCounterpart, accessToken);
    console.log("Withdrawal id:", withdrawalId);

    const okWithdraw = await yesno({ question: "Are you sure you want to withdraw?" });
    if (!okWithdraw) return console.log("Aborting...");
    await acceptWithdrawal(withdrawalId, accessToken);
  });

program
  .command('deposit')
  .description('give deposit instructions for the user')
  .argument('<string>', 'user id (DANIELLEE002 for sandbox)')
  .requiredOption('-a, --asset <asset symbol>', 'USD | USDC')
  .action(async (userId, options) => {
    if (!supportedAssets.includes(options.asset)) return console.error("Invalid asset");
    const accessToken = await authenticate();

    // creates fiat account if it doesn't exist
    await createDepositAccount(userId, options.asset, accessToken)

    // get deposit instructions
    const instructions = await getDepositInstructions(userId, options.asset, accessToken);
    console.log("Deposit instructions:", instructions);
    console.log("In sandbox copy memo id and use it in `create manual deposit` in the dashboard")
    for (const instruction of instructions.deposit_source.deposit_instructions) {
      console.log(" - ", instruction)
    }

  });

program
  .command('exchange')
  .description('exchange usdc for usd and vice versa')
  .argument('<string>', 'user id (DANIELLEE002 for sandbox)')
  .requiredOption('-a, --amount <amount>', 'source amount')
  .requiredOption('--from <from asset>', supportedAssets.join(" | "))
  .requiredOption('--to <to asset>', supportedAssets.join(" | "))
  .action(async (userId, options) => {
    if (!supportedAssets.includes(options.from)) return console.error("Invalid from asset");
    if (!supportedAssets.includes(options.to)) return console.error("Invalid to asset");
    if (options.from == options.to) return console.error("From and to assets must be different");

    const accessToken = await authenticate();
    await exchangeAssets(userId, options.from, options.to, Number(options.amount), accessToken);
  });

program
  .command('transfer')
  .description('send to crypto address')
  .argument('<string>', 'user id (DANIELLEE002 for sandbox)')
  .option('--to-address <to address>', "target crypto address")
  .option('--to-counterparty <to counterparty>', "target counterpoarty id")
  .requiredOption('--amount <amount>', "amount to withdraw")
  .requiredOption('--asset <crypto asset>', supportedAssets.join(" | "))
  .requiredOption('--user-country-code', "country code of the user")
  .action(async (userId, options) => {
    if (options.asset === "USD") return console.error("This is only for crypto");
    if (!options.toAddress && !options.toCounterparty) return console.error("You must specify either to-address or to-counterparty");
    if (options.toAddress && options.toCounterparty) return console.error("You must specify either to-address or to-counterparty, not both");

    const accessToken = await authenticate();
    let counterpartyId = options.toCounterparty;
    if (!counterpartyId) {
      // See if we can find address in counterparty already
      const counterparties = await getCounterparties(userId, accessToken);
      counterpartyId = (counterparties.find((c: any) => c.wallet_information.blockchain_address.toLowerCase() == options.toAddress.toLowerCase()))?.id;

      if (!counterpartyId)
        counterpartyId = await createCryptoCounterparty(userId, options.userCountryCode, options.toAddress, accessToken);
    }

    const withdrawalId = await createCryptoWithdrawal(userId, Number(options.amount), counterpartyId, accessToken);
    console.log("Withdrawal id:", withdrawalId);

    const okWithdraw = await yesno({ question: "Are you sure you want to withdraw?" });
    if (!okWithdraw) return console.log("Aborting...");
    await acceptWithdrawal(withdrawalId, accessToken);
  });

program
  .command('counterparties')
  .description('list counterparties for user')
  .argument('<string>', 'user id (DANIELLEE002 for sandbox)')
  .action(async (userId, options) => {
    const accessToken = await authenticate();
    const counterparties = await getCounterparties(userId, accessToken);

    console.log("Counterparties for user", userId);
    console.log(counterparties);
  });

program.parse();
