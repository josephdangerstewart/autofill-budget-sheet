import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate } from './google';


async function main() {
	const accessToken = await getAccessToken();
	const transactions = await getTransactions(accessToken, new Date('2021-10-01'));
	console.log(transactions);
	process.exit(0);
}

main();
