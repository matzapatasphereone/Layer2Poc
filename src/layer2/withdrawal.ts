import axios from "axios";
import { createAccountId } from "./accounts";
import { LAYER2_BASE_URL } from "../config";

// Returns withdrawal id
export const createCryptoWithdrawal = async (userId: string, amount: number, destinationCounterpartyId: string, accessToken: string) => {
    let data = JSON.stringify({
        "withdrawal_rail": "CRYPTO",
        "description": "Withdraw crypto",
        "source_account_id": createAccountId(userId, "USDC"),
        "amount": amount,
        "destination_counterparty_id": destinationCounterpartyId,
        "memo": "withdrawal"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/withdrawals`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        data: data
    };

    return (await axios.request(config)).data.data.id;
}

export const acceptWithdrawal = async (withdrawalId: string, accessToken: string) => {
    return (await axios.request({
        method: 'post',
        maxBodyLength: Infinity,
        url: `${LAYER2_BASE_URL}/withdrawals/${withdrawalId}/accept`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })).data.data.status
}