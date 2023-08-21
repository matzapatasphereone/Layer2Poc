# Example commands

## Account

```
tsx src/index.ts account DANIELLEE002
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
tsx src/index.ts deposit DANIELLEE002 -a USD
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
tsx src/index.ts deposit DANIELLEE002 -a USDC
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
tsx src/index.ts exchange DANIELLEE002 --from USD --to USDC --amount 1
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

tsx src/index.ts account DANIELLEE002
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
tsx src/index.ts exchange DANIELLEE002 --from USDC --to USD --amount 0.5
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
