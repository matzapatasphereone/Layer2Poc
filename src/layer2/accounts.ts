import axios from "axios";
import { LAYER2_BASE_URL } from "../config";

export type SupportedAssets = "USDC" | "USD" | "ETH";
export const supportedAssets: SupportedAssets[] = ["USDC", "USD", "ETH"]
export const assetToId = {
    "USDC": "ETHEREUM_GOERLI_USDC",
    "USD": "FIAT_TESTNET_USD",
    "ETH": "ETHEREUM_GOERLI_ETH"
}

export const createAccountId = (customerId: string, symbol: SupportedAssets) => {
    return `${customerId}_${symbol}`
}

// Creates fiat account if not exists. 
export const createDepositAccount = async (customerId: string, asset: SupportedAssets, accessToken: string) => {
    const asset_type_id = assetToId[asset];
    if (!asset_type_id) throw new Error("Invalid asset type id");
    const product_id = asset == "USD" ? "DEPOSIT_FORT_FIAT" : "DEPOSIT_FORT_CRYPTO";

    let data = JSON.stringify({
        "customer_id": customerId,
        "account_to_open": {
            "account_id": createAccountId(customerId, asset),
            "product_id": product_id,
            "asset_type_id": asset_type_id
        }
    });

    try {
        await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: `${LAYER2_BASE_URL}/accounts/deposits`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            data: data
        })
        return true;
    } catch (e: any) {
        if (e.response.data.errors[0].code == "L2F-101") return true // Account already exists
        else return false;
    }
}

export const getAccountDetails = async (customerId: string, accessToken: string) => {
    const getAccount = async (accountId: string) => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${LAYER2_BASE_URL}/accounts/deposits/${accountId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        return (await axios.request(config)).data
    }

    const fiatAccount = await getAccount(createAccountId(customerId, "USD"));
    const usdcAccount = await getAccount(createAccountId(customerId, "USDC"));
    const ethAccount = await getAccount(createAccountId(customerId, "ETH"));

    return {
        fiatAccount,
        usdcAccount,
        ethAccount
    }
}