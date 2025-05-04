import { Client, Account,Databases } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6806eb4e001fc70cb2fe')
    .setPlatform('com.skill-link');
    const account = new Account(client);
const database = new Databases(client);
const DATABASE_ID ="6806faf500120a20c1d6";
const COLLECTION_IDs={
    users:"6806fb06000ca2f461c9",
    service_requests:"680a6ea20014effa5ac0",
    proposals:"680b8146002266653489",
    messages:"68175ddd000fb33c6be7",
    conversations:"68175e61000293fdcbe5",
}

export { client, account , database, DATABASE_ID, COLLECTION_IDs};