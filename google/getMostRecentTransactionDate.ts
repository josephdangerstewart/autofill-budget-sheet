import { parse } from 'date-fns';
import maxBy = require('lodash.maxby');
import { sheetInfo } from './sheetInfo';
import { getSheetData } from './sheetManipulation';

export async function getMostRecentTransactionDate(): Promise<Date | null> {
	const response = await getSheetData(sheetInfo.sheets.transactions, 1);
	const allDates = response
		?.map((x)=> x.date && parse(x.date, 'yyyy-MM-dd', new Date()))
		.filter(x => x && !isNaN(x.getTime()));

	if (!allDates?.length) {
		return null;
	}

	const maxDate = maxBy(allDates, x => x.valueOf());

	return maxDate;
}
