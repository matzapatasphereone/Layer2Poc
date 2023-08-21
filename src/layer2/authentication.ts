import axios from 'axios';
import { LAYER2_SECRET } from '../config';

export const authenticate = async () => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://auth.layer2financial.com/oauth2/ausbdqlx69rH6OjWd696/v1/token?grant_type=client_credentials&scope=accounts:read+settlements:read+customers:read+customers:write+accounts:write+withdrawals:read+withdrawals:write+adjustments:read+adjustments:write+exchanges:read+exchanges:write+transfers:read+transfers:write+deposits:read+deposits:write+applications:read+applications:write',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            Authorization: `Basic ${LAYER2_SECRET}`
        }
    };

    return (await axios.request(config)).data.access_token;
};
