import axios from "axios";
import { SupportedAssets, createAccountId } from "./accounts";
import { LAYER2_BASE_URL } from "../config";

export const getDepositInstructions = async (userId: string, symbol: SupportedAssets, accessToken: string) => {
    let data = JSON.stringify({
        "deposit_type": "PUSH",
        "deposit_destination": {
            "destination_account_id": createAccountId(userId, symbol),
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/deposits`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        data: data
    };

    return (await axios.request(config)).data
}


