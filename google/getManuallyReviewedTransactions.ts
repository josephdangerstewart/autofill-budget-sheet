import { ClassificationResult } from '../types';
import { getSheetData, parseDollars } from './sheetManipulation';
import { sheetInfo } from './sheetInfo';
import { parse } from 'date-fns';
import { clearSheetData } from './sheetManipulation/clearSheetData';

export async function getManuallyReviewedTransactions(): Promise<ClassificationResult[]> {
	const results = await getSheetData(sheetInfo.sheets.needsManualReview, 1);
	await clearSheetData(sheetInfo.sheets.needsManualReview);

	return results.map((x) => {
		if (!x.id) {
			// the row was deleted
			return null;
		}

		if (x.manuallyEnteredCategory?.trim()) {
			return {
				status: 'success',
				behavior: x.manuallyEnteredCategory,
				plaidTransaction: {
					id: x.id,
					amount: parseDollars(x.amount),
					categories: x.plaidCategories?.split(',').map(x => x.trim()) ?? [],
					date: parse(x.date, 'yyyy-MM-dd', new Date()),
					merchantName: x.merchant,
					rawName: x.name,
				},
			};
		}

		return {
			status: 'error',
			plaidTransaction: {
				id: x.id,
				amount: parseDollars(x.amount),
				categories: x.plaidCategories.split(',').map(x => x.trim()),
				date: parse(x.date, 'yyyy-MM-dd', new Date()),
				merchantName: x.merchant,
				rawName: x.name,
			},
		};
	}).filter((x): x is ClassificationResult => Boolean(x));
}
