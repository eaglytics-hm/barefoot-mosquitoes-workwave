import { Firestore, Timestamp } from '@google-cloud/firestore';

export type AccessToken = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: Date | Timestamp;
};

const firestoreClient = new Firestore();

export const tokenCollection = firestoreClient.collection('workwave-access-token');
