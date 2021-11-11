import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate } from './google';


async function main() {
	const mostRecentDate = await getMostRecentTransactionDate();

	console.log(mostRecentDate);

	process.exit(0);
}

main();
