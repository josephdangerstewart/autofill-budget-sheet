import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate } from './google';


async function main() {
	await getMostRecentTransactionDate();
}

main();
