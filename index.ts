import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessToken, getTransactions } from './plaid';


async function main() {
	const plaidAccessToken = await getAccessToken();
	await getTransactions(plaidAccessToken, new Date('2021-01-01'));
	process.exit(0);
}

main();
