import { parse } from 'date-fns';
import { sheetInfo } from './sheetInfo';
import { getSheetData } from './getSheetData';

export async function getMostRecentTransactionDate(): Promise<Date | null> {
	const response = await getSheetData(sheetInfo.sheets.mostRecentTransaction, 1, 1);
	const mostRecentDate = response[0]?.mostRecentTransaction;

	const parsedDate = parse(mostRecentDate, 'yyyy-MM-dd', new Date());

	if (!mostRecentDate || isNaN(parsedDate?.getTime() ?? NaN)) {
		return null;
	}

	return parsedDate;
}
