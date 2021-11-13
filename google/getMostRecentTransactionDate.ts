import { parse } from 'date-fns';
import maxBy = require('lodash.maxby');
import { sheetInfo } from './sheetInfo';
import { getSheetData } from './sheetManipulation';

export async function getMostRecentTransactionDate(): Promise<Date | null> {
	const [
		classifiedTransactionsResponse,
		incomeTransactionsResponse,
		manualReviewTransactionsResponse,
	] = await Promise.all([
		getSheetData(sheetInfo.sheets.transactions, 1),
		getSheetData(sheetInfo.sheets.income, 1),
		getSheetData(sheetInfo.sheets.needsManualReview, 1),
	]);

	const transactionDates = classifiedTransactionsResponse
		?.filter((x) => x.wasAutoAdded === 'YES' && x.id)
		.map((x) => x.date) ?? [];
	
	const incomeDates = incomeTransactionsResponse
		?.filter((x) => x.wasAutoAdded === 'YES' && x.id)
		.map((x) => x.date) ?? [];
	
	const manualReviewDates = manualReviewTransactionsResponse
		?.filter((x) => x.id)
		.map((x) => x.date) ?? [];

	const allDates = [
		...transactionDates,
		...incomeDates,
		...manualReviewDates
	]
	.map((x)=> x && parse(x, 'yyyy-MM-dd', new Date()))
	.filter(x => x && !isNaN(x.getTime()))

	if (!allDates.length) {
		return null;
	}

	const maxDate = maxBy(allDates, x => x.valueOf());

	return maxDate;
}
