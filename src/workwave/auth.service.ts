import axios from 'axios';
import { add, isAfter } from 'date-fns';
import { Firestore, Timestamp } from '@google-cloud/firestore';

import { TenantEnum } from './tenant.enum';

const firestoreClient = new Firestore();

const collection = firestoreClient.collection('workwave-access-token');

export const getClient = async (tenant: TenantEnum) => {
    type AccessToken = {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expires_at: Date | Timestamp;
    };

    const ensureToken = async () => {
        const token = await collection
            .doc(tenant)
            .get()
            .then((doc) => doc.data() as AccessToken | undefined);

        if (token && token.expires_at instanceof Timestamp && isAfter(token.expires_at.toDate(), new Date())) {
            return token.access_token;
        }

        const accessToken = await axios
            .request<AccessToken>({
                method: 'POST',
                url: 'https://is.workwave.com/oauth2/token',
                auth: { username: process.env.WORKWAVE_CLIENT_ID!, password: process.env.WORKWAVE_CLIENT_SECRET! },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: { scope: 'openid' },
                data: {
                    grant_type: 'password',
                    username: process.env.WORKWAVE_USERNAME,
                    password: process.env.WORKWAVE_PASSWORD,
                },
            })
            .then((response) => response.data);

        await collection
            .doc(tenant)
            .set({ ...accessToken, expires_at: add(new Date(), { seconds: accessToken.expires_in }) });

        return accessToken.access_token;
    };

    const accessToken = await ensureToken();

    return axios.create({
        baseURL: 'https://api.workwave.com/pestpac/v1',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: process.env.WORKWAVE_API_KEY,
            'tenant-id': tenant,
        },
    });
};
