import sortBy = require('lodash.sortby');
import { ClassificationResult, SuccessClassificationResult, PlaidTransaction, RecordClassificationsResults } from '../types';
import { format } from 'date-fns';
import { addSheetData } from './sheetManipulation';
import { sheetInfo } from './sheetInfo';

export async function recordClassificationResults(results: ClassificationResult[]): Promise<RecordClassificationsResults> {
	const forManualReview = results
		.filter((x) => (
			(x.status === 'error' || x.behavior === '$ASK_EVERY_TIME') &&
			x.plaidTransaction.amount >= 0
		))
		.map((x) => x.plaidTransaction);
	
	const forSuccess = results
		.filter((x): x is SuccessClassificationResult => (
			x.status === 'success' &&
			x.plaidTransaction.amount >= 0 &&
			x.behavior !== '$ASK_EVERY_TIME' &&
			x.behavior !== '$IGNORE'
		));

	const income = results
		.filter((x) => x.plaidTransaction.amount < 0)
		.map(x => x.plaidTransaction);

	await Promise.all([
		markForManualReview(sortBy(forManualReview, [(x) => x.date.toISOString()])),
		recordSuccess(sortBy(forSuccess, [o => o.plaidTransaction.date.toISOString()])),
		recordIncome(sortBy(income, [o => o.date.toISOString()])),
	]);

	return {
		manualReview: forManualReview,
		income,
		classified: forSuccess,
	};
}

async function recordIncome(results: PlaidTransaction[]): Promise<void> {
	await addSheetData(sheetInfo.sheets.income, results.map((plaidTransaction) => ({
		id: plaidTransaction.id,
		name: plaidTransaction.rawName,
		date: format(plaidTransaction.date, 'yyyy-MM-dd'),
		amount: (plaidTransaction.amount * -1).toString(),
		wasAutoAdded: 'YES',
	})));
}

async function markForManualReview(results: PlaidTransaction[]): Promise<void> {
	await addSheetData(sheetInfo.sheets.needsManualReview, results.map((plaidTransaction) => ({
		id: plaidTransaction.id,
		name: plaidTransaction.rawName,
		merchant: plaidTransaction.merchantName,
		date: format(plaidTransaction.date, 'yyyy-MM-dd'),
		amount: plaidTransaction.amount.toString(),
		plaidCategories: plaidTransaction.categories.join(', '),
		manuallyEnteredCategory: '',
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
