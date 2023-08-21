import { Command } from 'commander';
import { getUsdBalance, getUsdcBalance } from './layer2/balances';
import { authenticate } from './layer2/authentication';
import { createDepositAccount, getAccountDetails } from './layer2/accounts';
import { getDepositInstructions } from './layer2/deposits';
import yesno from 'yesno';
import { buyUsdc } from './layer2/exchange';
import { acceptWithdrawal, createWithdrawal } from './layer2/withdrawal';
const program = new Command();

program
  .name('Layer2')
  .description('A simple CLI for Layer2')
  .version('0.8.0');

program
  .command('account')
  .description('Get balances for the user accounts')
  .argument('<string>', 'User id')
  .option('--create-fiat', 'creates fiat account for the user')
  .option('--create-crypto', 'creates usdc account for the user')
  .action(async (userId, options) => {
    const accessToken = await authenticate();

    console.log(options)
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
  .command('balances')
  .description('Get balances for the user accounts')
  .argument('<string>', 'User id')
  .action(async (userId) => {
    const accessToken = await authenticate();
    const usdcBalance = await getUsdcBalance(userId, accessToken);
    const usdBalance = await getUsdBalance(userId, accessToken);

    console.log("Balances for user", userId);
    console.log("USDC:", usdcBalance);
    console.log("USD:", usdBalance);
  });


program
  .command('onramp')
  .description('Buy USDC with USD')
  .argument('<string>', 'User id')
  .requiredOption('-a, --amount <amount>', 'Amount of USD to buy USDC with')
  .option("-wc, --withdrawal-counterpart <id>", "Withdrawal counterpart id")
  .action(async (userId, options) => {
    const accessToken = await authenticate();

    // check for account

    // get deposit instructions
    const instructions = await getDepositInstructions(userId, "USD", accessToken);
    console.log("Deposit instructions:", instructions.data);
    console.log("In sandbox copy memo id and use it in `create manual deposit` in the dashboard")
    for (const instruction of instructions.data.deposit_source.deposit_instructions) {
      console.log(" - ", instruction)
    }
    const ok = await yesno({ question: "Have you deposited?" });
    if (!ok) return console.log("Aborting...");

    // buy crypto
    const prevUsdcBalance = (await getUsdcBalance(userId, accessToken)).available_balance;
    await buyUsdc(userId, Number(options.amount), accessToken);

    // Wait for the transaction to complete
    for (let i = 0; i < 10; i++) {
      const usdcBalance = (await getUsdcBalance(userId, accessToken)).available_balance;
      if ((prevUsdcBalance + options.amount) <= usdcBalance) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Withdraw crypto
    const withdrawalId = await createWithdrawal(userId, Number(options.amount), options.withdrawalCounterpart, accessToken);
    console.log("Withdrawal id:", withdrawalId);
    // Print counterpart data
    const okWithdraw = await yesno({ question: "Are you sure you want to withdraw?" });
    if (!okWithdraw) return console.log("Aborting...");
    await acceptWithdrawal(withdrawalId, accessToken);
  });

program
  .command('deposit')
  .description('give deposit instructions for the user')
  .argument('<string>', 'user id')
  .option('--fiat', 'creates fiat account for the user if it does not exist and gives deposit instructions')
  .option('--crypto', 'creates usdc account for the user if it does not exist and gives deposit instructions')
  .action(async (userId, options) => {
    const accessToken = await authenticate();


    if (options.fiat) {
      // creates fiat account if it doesn't exist
      await createDepositAccount(userId, "USD", accessToken)

      // get deposit instructions
      const instructions = await getDepositInstructions(userId, "USD", accessToken);
      const prevUsdBalance = (await getUsdBalance(userId, accessToken)).available_balance;
      console.log("Deposit instructions:", instructions.data);
      console.log("In sandbox copy memo id and use it in `create manual deposit` in the dashboard")
      for (const instruction of instructions.data.deposit_source.deposit_instructions) {
        console.log(" - ", instruction)
      }
      const ok = await yesno({ question: "Have you deposited?" });
      if (!ok) return console.log("Aborting...");

      // Wait for the transaction to complete
      for (let i = 0; i < 10; i++) {
        const usdBalance = (await getUsdBalance(userId, accessToken)).available_balance;
        if ((prevUsdBalance + options.amount) <= usdBalance)
          return console.log("Deposit successful");

        if (i == 9) return console.log("Deposit failed");
        else await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else if (options.crypto) {

    }

  });

program.parse();
