import { Firestore, Timestamp } from '@google-cloud/firestore';

const firestoreClient = new Firestore();

export type AccessToken = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: Date | Timestamp;
};

const token = () => firestoreClient.collection('workwave-access-token').doc('access-token');

export const get = async () => {
    return await token()
        .get()
        .then((doc) => doc.data() as AccessToken | undefined);
};

export const set = async (data: AccessToken) => {
    return await token().set(data);
};
