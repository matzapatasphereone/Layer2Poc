# Setup

Create `src/config.ts` with:

```ts
const LAYER2_BASE_URL = 'https://sandbox.layer2financial.com/api/v1';
const LAYER2_SECRET = 'MG9hNm4xeWNzOWhWM0hn...';

export { LAYER2_BASE_URL, LAYER2_SECRET };
```

Run on console

```bash
npm install
npm run build
npm link
```

# Example commands

## Help

```
l2 --help
Usage: Layer2 [options] [command]

A simple CLI for Layer2

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  account [options] <string>   get available accounts and balances
  onramp [options] <string>    Buy USDC with USD
  deposit [options] <string>   give deposit instructions for the user
  exchange [options] <string>  exchange usdc for usd and vice versa
  transfer [options] <string>  send to crypto address
  counterparties <string>      list counterparties for user
  help [command]               display help for command
```

## Account

```
l2 account DANIELLEE002
Accounts for user DANIELLEE002
{
  fiatAccount: {
    data: {
      id: 'DANIELLEE002_USD',
      status: 'OPEN',
      asset_type_id: 'FIAT_TESTNET_USD',
      product_id: 'DEPOSIT_FORT_FIAT',
      current_balance: 100,
      available_balance: 100
    }
  },
  cryptoAccount: {
    data: {
      id: 'DANIELLEE002_USDC',
      status: 'OPEN',
      asset_type_id: 'ETHEREUM_GOERLI_USDC',
      product_id: 'DEPOSIT_FORT_CRYPTO',
      current_balance: 0,
      available_balance: 0
    }
  }
}
```

## Deposit instructions

### USD (Fiat)

```
l2 deposit DANIELLEE002 -a USD
Deposit instructions: {
  id: 'c30415d0-0285-442b-9b7c-1dcf423951b2',
  status: 'EXECUTED',
  created_timestamp: '2023-08-18T18:08:53.745647-04:00',
  deposit_type: 'PUSH',
  deposit_destination: {
    destination_account_id: 'DANIELLEE002_USD',
    asset_type_id: 'FIAT_TESTNET_USD'
  },
  customer_name: 'DANIELLEE002',
  deposit_source: { deposit_instructions: [ [Object], [Object] ] }
}
In sandbox copy memo id and use it in `create manual deposit` in the dashboard
 -  {
  instruction_type: 'FEDWIRE',
  asset_type_id: 'FIAT_TESTNET_USD',
  account_holder_name: 'DANIELLEE002',
  account_number: '591427090743',
  account_routing_number: '021001208',
  memo: '240cacd6-dfa8-42b7-a4de-05834e2ed223',
  account_holder_address: {
    address_line1: '1 Financial Place',
    city: 'Boston',
    state: 'MA',
    postal_code: '02135',
    country_code: 'US'
  },
  institution_address: {
    address_line1: '123 Cherry Street',
    address_line2: '',
    city: 'Duluth',
    state: 'MN',
    postal_code: '55812',
    country_code: 'US'
  }
}
 -  {
  instruction_type: 'ACH',
  asset_type_id: 'FIAT_TESTNET_USD',
  account_holder_name: 'DANIELLEE002',
  account_number: '591427090743',
  account_routing_number: '021001208',
  memo: 'd5ab88a5-22e1-40e7-b5c4-a489d9a7f5bf'
}
```

### USDC (Crypto)

```
l2 deposit DANIELLEE002 -a USDC
Deposit instructions: {
  id: '8ee6f7ef-b419-4f98-9116-665c6cf824d9',
  status: 'REQUESTED',
  created_timestamp: '2023-08-20T23:48:55.745527-04:00',
  deposit_type: 'PUSH',
  deposit_destination: {
    destination_account_id: 'DANIELLEE002_USDC',
    asset_type_id: 'ETHEREUM_GOERLI_USDC'
  },
  customer_name: 'DANIELLEE002',
  deposit_source: { deposit_instructions: [ [Object] ] }
}
In sandbox copy memo id and use it in `create manual deposit` in the dashboard
 -  {
  instruction_type: 'CRYPTO',
  asset_type_id: 'ETHEREUM_GOERLI_USDC',
  address: '0x0E3B55C3E15C6a436B293c643865BfFf3830db9A',
  blockchain: 'ethereum',
  network: 'goerli'
}
```

## Exchange

Note here, sometimes takes some time to confirm tx and see balances reflected

### Usd to Usdc

```
l2 exchange DANIELLEE002 --from USD --to USDC --amount 1
Buy quote: {
  id: '34d3a09a-8c10-4a24-8c3b-c55ac2a14859',
  status: 'REQUESTED',
  created_timestamp: '2023-08-21T00:01:57.049552-04:00',
  action: 'FIX_SOURCE',
  source_details: {
    source_account_id: 'DANIELLEE002_USD',
    asset_type_id: 'FIAT_TESTNET_USD',
    amount_to_debit: 1
  },
  destination_details: {
    destination_account_id: 'DANIELLEE002_USDC',
    asset_type_id: 'ETHEREUM_GOERLI_USDC',
    amount_to_credit: 0.990099
  }
}
Are you sure you want to continue? y
Accepted quote: {
  id: '34d3a09a-8c10-4a24-8c3b-c55ac2a14859',
  status: 'ACCEPTED',
  created_timestamp: '2023-08-21T00:01:57.049552-04:00',
  action: 'FIX_SOURCE',
  source_details: {
    source_account_id: 'DANIELLEE002_USD',
    asset_type_id: 'FIAT_TESTNET_USD',
    amount_to_debit: 1
  },
  destination_details: {
    destination_account_id: 'DANIELLEE002_USDC',
    asset_type_id: 'ETHEREUM_GOERLI_USDC'
  }
}

l2 account DANIELLEE002
Accounts for user DANIELLEE002
{
  fiatAccount: {
    data: {
      id: 'DANIELLEE002_USD',
      status: 'OPEN',
      asset_type_id: 'FIAT_TESTNET_USD',
      product_id: 'DEPOSIT_FORT_FIAT',
      current_balance: 98,
      available_balance: 98
    }
  },
  cryptoAccount: {
    data: {
      id: 'DANIELLEE002_USDC',
      status: 'OPEN',
      asset_type_id: 'ETHEREUM_GOERLI_USDC',
      product_id: 'DEPOSIT_FORT_CRYPTO',
      current_balance: 0.99,
      available_balance: 0.99
    }
  }
}
```

### USDC to USD

```
l2 exchange DANIELLEE002 --from USDC --to USD --amount 0.5
Buy quote: {
  id: '6612f302-8a0f-4b6b-bcd1-fd3ad90de009',
  status: 'REQUESTED',
  created_timestamp: '2023-08-21T00:06:17.194343-04:00',
  action: 'FIX_SOURCE',
  source_details: {
    source_account_id: 'DANIELLEE002_USDC',
    asset_type_id: 'ETHEREUM_GOERLI_USDC',
    amount_to_debit: 0.5
  },
  destination_details: {
    destination_account_id: 'DANIELLEE002_USD',
    asset_type_id: 'FIAT_TESTNET_USD',
    amount_to_credit: 0.49
  }
}
Are you sure you want to continue? y
Accepted quote: {
  id: '6612f302-8a0f-4b6b-bcd1-fd3ad90de009',
  status: 'ACCEPTED',
  created_timestamp: '2023-08-21T00:06:17.194343-04:00',
  action: 'FIX_SOURCE',
  source_details: {
    source_account_id: 'DANIELLEE002_USDC',
    asset_type_id: 'ETHEREUM_GOERLI_USDC',
    amount_to_debit: 0.5
  },
  destination_details: {
    destination_account_id: 'DANIELLEE002_USD',
    asset_type_id: 'FIAT_TESTNET_USD'
  }
}
```

## Counterparties

```
l2 counterparties DANIELLEE002
Counterparties for user DANIELLEE002
[
  {
    id: '6fa77880-9234-4c27-8523-43bf28e27320',
    customer_id: 'DANIELLEE002',
    counterparty_type: 'CRYPTO',
    is_international: false,
    supported_rails: [ 'CRYPTO' ],
    description: 'sample counterparty',
    profile: {
      name: 'DANIELLEE002',
      address: [Object],
      relationship_to_customer: 'SELF'
    },
    wallet_information: {
      blockchain_address: '0xAF055a6CDC2c87C6293d4aA7FD0488916F2e7d2b',
      wallet_type: 'OTHER',
      institution_name: 'SUPERCUSTODY',
      institution_address: [Object]
    }
  },
  {
    id: '77e70c00-7b2f-4868-b2af-5a3fc53ffbf6',
    customer_id: 'DANIELLEE002',
    counterparty_type: 'CRYPTO',
    is_international: false,
    supported_rails: [ 'CRYPTO' ],
    description: 'sample counterparty',
    profile: { name: 'kk', address: [Object], relationship_to_customer: 'SELF' },
    wallet_information: {
      blockchain_address: '0xAF055a6CDC2c87C6293d4aA7FD0488916F2e7d2b',
      wallet_type: 'OTHER',
      institution_name: 'SUPERCUSTODY',
      institution_address: [Object]
    }
  },
  {
    id: 'be89ed65-963d-42bf-9585-e7a136e3bd40',
    customer_id: 'DANIELLEE002',
    counterparty_type: 'CRYPTO',
    is_international: false,
    supported_rails: [ 'CRYPTO' ],
    description: 'sample counterparty',
    profile: {
      name: 'tarun',
      address: [Object],
      relationship_to_customer: 'SELF'
    },
    wallet_information: {
      blockchain_address: '0xAF055a6CDC2c87C6293d4aA7FD0488916F2e7d2b',
      wallet_type: 'OTHER',
      institution_name: 'SUPERCUSTODY',
      institution_address: [Object]
    }
  },
  {
    id: 'c89f0065-511b-4b03-8a99-29412b3b5f44',
    customer_id: 'DANIELLEE002',
    counterparty_type: 'CRYPTO',
    is_international: false,
    supported_rails: [ 'CRYPTO' ],
    description: 'sample counterparty',
    profile: {
      name: 'DANIELLEE002',
      address: [Object],
      relationship_to_customer: 'SELF'
    },
    wallet_information: {
      blockchain_address: '0xAF055a6CDC2c87C6293d4aA7FD0488916F2e7d2b',
      wallet_type: 'OTHER',
      institution_name: 'SUPERCUSTODY',
      institution_address: [Object]
    }
  },
  {
    id: 'dbeffb5c-b43a-4d89-88de-a311f17d3d5b',
    customer_id: 'DANIELLEE002',
    counterparty_type: 'CRYPTO',
    is_international: false,
    supported_rails: [ 'CRYPTO' ],
    description: 'sample counterparty',
    profile: {
      name: 'DANIELLEE002',
      address: [Object],
      relationship_to_customer: 'SELF'
    },
    wallet_information: {
      blockchain_address: '0xAF055a6CDC2c87C6293d4aA7FD0488916F2e7d2b',
      wallet_type: 'OTHER',
      institution_name: 'SUPERCUSTODY',
      institution_address: [Object]
    }
  }
]
```
