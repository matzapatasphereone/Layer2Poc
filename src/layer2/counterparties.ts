import axios from "axios";
import { LAYER2_BASE_URL } from "../config";

export const createCryptoCounterparty = async (userId: string, countryCode: string, address: string, accessToken: string) => {
    let data = JSON.stringify({
        "customer_id": userId,
        "description": "sample counterparty",
        "counterparty_type": "CRYPTO",
        "is_international": false,
        "supported_rails": ["CRYPTO"],
        "profile": {
            "name": userId,
            "address": { "country_code": countryCode },
            "relationship_to_customer": "SELF"
        },
        "wallet_information": {
            "asset_type_id": "ETHEREUM_GOERLI_USDC",
            "blockchain_address": address,
            "wallet_type": "OTHER",
            "institution_name": "SUPERCUSTODY",
            "institution_address": { "country_code": countryCode }
        }
    });


    return (await axios.request({
        method: 'post',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/counterparties`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        data: data
    })).data.id
}

export const getCounterparties = async (userId: string, accessToken: string) => {
    return (await axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/counterparties?custome_id=${userId}`,
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })).data.data.counterparties
}