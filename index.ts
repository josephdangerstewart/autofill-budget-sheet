import * as dotenv from 'dotenv';
dotenv.config();

import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate, getRules } from './google';
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

	// console.log(JSON.stringify(rules[rules.length - 1], null, 2));

	const transactions = await getTransactions(plaidAccessToken, lastTransactionDate);

	const classifications = tryClassifyTransactions(transactions, rules);

	console.log(classifications.slice(0, 10).map((c) => ({
		...c,
		plaidCategories: c.plaidTransaction.categories,
	})));

	process.exit(0);
}

main();
