import sortBy = require('lodash.sortby');
import { ClassificationResult, SuccessClassificationResult, PlaidTransaction } from '../types';
import { format } from 'date-fns';
import { addSheetData } from './addSheetData';
import { sheetInfo } from './sheetInfo';

export async function recordClassificationResults(results: ClassificationResult[]): Promise<void> {
	const forManualReview = results
		.filter((x) => x.status === 'error' || x.behavior === '$ASK_EVERY_TIME')
		.map((x) => x.plaidTransaction);
	
	const forSuccess = results
		.filter((x): x is SuccessClassificationResult => (
			x.status === 'success' &&
			x.behavior !== '$ASK_EVERY_TIME' &&
			x.behavior !== '$IGNORE'
		));

	await Promise.all([
		markForManualReview(sortBy(forManualReview, [(x) => x.date.toISOString()])),
		recordSuccess(sortBy(forSuccess, [o => o.plaidTransaction.date.toISOString()])),
	]);
}

async function markForManualReview(results: PlaidTransaction[]): Promise<void> {
	await addSheetData(sheetInfo.sheets.needsManualReview, results.map((plaidTransaction) => ({
		id: plaidTransaction.id,
		name: plaidTransaction.rawName,
		merchant: plaidTransaction.merchantName,
		date: format(plaidTransaction.date, 'yyyy-MM-dd'),
		amount: plaidTransaction.amount.toString(),
		plaidCategories: plaidTransaction.categories.join(', '),
	})));
}

async function recordSuccess(results: SuccessClassificationResult[]): Promise<void> {
	await addSheetData(sheetInfo.sheets.transactions, results.map(({ behavior, plaidTransaction }) => ({
		id: plaidTransaction.id,
		name: plaidTransaction.rawName,
		merchant: plaidTransaction.merchantName,
		date: format(plaidTransaction.date, 'yyyy-MM-dd'),
		amount: plaidTransaction.amount.toString(),
		plaidCategories: plaidTransaction.categories.join(', '),
		wasAutoAdded: 'YES',
		category: behavior,
	})));
}
