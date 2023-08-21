import axios from "axios";
import { LAYER2_BASE_URL } from "../config";
import { createAccountId } from "./accounts";

export const getUsdBalance = async (customerId: string, accessToken: string) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/accounts/deposits/${createAccountId(customerId, "USD")}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    };

    return (await axios.request(config)).data.data
}

export const getUsdcBalance = async (customerId: string, accessToken: string) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/accounts/deposits/${createAccountId(customerId, "USDC")}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    };

    return (await axios.request(config)).data.data;
}