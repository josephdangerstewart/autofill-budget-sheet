import * as dotenv from 'dotenv';
dotenv.config();

import { subMonths } from 'date-fns';
import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate, getRules, recordClassificationResults } from './google';
import { tryClassifyTransactions } from './classifier';


async function main() {
	const [
		plaidAccessToken,
		lastTransactionDate,
		rules
	] = await Promise.all([
		getAccessToken(),
		getMostRecentTransactionDate(),
		getRules(),
	]);

	console.log(lastTransactionDate);

	const transactions = await getTransactions(
		plaidAccessToken,
		lastTransactionDate ?? subMonths(new Date, 3)
	);

	const classifications = tryClassifyTransactions(transactions, rules);

	await recordClassificationResults(classifications);

	process.exit(0);
}

main();
