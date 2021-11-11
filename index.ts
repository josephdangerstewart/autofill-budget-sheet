import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate, getRules } from './google';


async function main() {
	const rules = await getRules();

	console.log(rules);

	process.exit(0);
}

main();
