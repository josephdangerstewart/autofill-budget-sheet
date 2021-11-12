import { getAccessToken, getTransactions } from './plaid';
import { getMostRecentTransactionDate, getRules, recordClassificationResults } from './google';
import { subMonths } from 'date-fns';
import { tryClassifyTransactions } from './classifier';

export async function addTransactionsToSheet() {
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
	return classifications;
}
