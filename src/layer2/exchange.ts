import axios from 'axios';
import { createAccountId } from './accounts';
import { LAYER2_BASE_URL } from '../config';
import yesno from 'yesno';

export const buyUsdc = async (userId: string, amount: number, accessToken: string) => {
    const getBuyQuote = async (amount: number) => {
        let data = JSON.stringify({
            "source_account_id": createAccountId(userId, "USD"),
            "destination_account_id": createAccountId(userId, "USDC"),
            "amount": amount,
            "action": "FIX_SOURCE"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${LAYER2_BASE_URL}/exchanges/market`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: data
        };

        return (await axios.request(config)).data.data;
    }
    const acceptQuote = async (quoteId: string, maximumSlippage = "0.01") => {
        let data = JSON.stringify({ "maximum_slippage": maximumSlippage });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${LAYER2_BASE_URL}/exchanges/${quoteId}/accept`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: data
        };

        return (await axios.request(config)).data.data;
    }

    const quote = await getBuyQuote(amount);
    console.log("Buy quote:", quote);

    const ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) return console.log("Aborting...");

    const acceptedQuote = await acceptQuote(quote.quote_id);
    console.log("Accepted quote:", acceptedQuote);

}