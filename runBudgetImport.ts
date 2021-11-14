import uniqBy = require('lodash.uniqby');
import { getAccessToken, getTransactions } from './plaid';
import {
	getMostRecentTransactionDate,
	getRules,
	recordClassificationResults,
	ensureMonthlyBudgetSheetExists,
} from './google';
import { subMonths, format } from 'date-fns';
import { tryClassifyTransactions } from './classifier';
import { sendImportNotifications } from './discord';

export async function runBudgetImport() {
	const [
		plaidAccessToken,
		lastTransactionDate,
		rules,
	] = await Promise.all([
		getAccessToken(false),
		getMostRecentTransactionDate(),
		getRules(),
	]);

	const transactions = await getTransactions(
		plaidAccessToken,
		lastTransactionDate ?? subMonths(new Date, 3)
	);

	const classifications = tryClassifyTransactions(transactions, rules);

	const importResults = await recordClassificationResults(classifications);

	const uniqueMonths = uniqBy(
		classifications.map((x) => x.plaidTransaction.date),
		d => format(d, 'LLL yyyy'),
	);

	const promises = uniqueMonths.map(x => ensureMonthlyBudgetSheetExists(x));

	await Promise.all([...promises, sendImportNotifications(importResults)]);
}
