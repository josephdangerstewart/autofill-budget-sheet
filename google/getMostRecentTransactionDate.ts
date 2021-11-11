import { sheetInfo } from './sheetInfo';
import { getSheetData } from './getSheetData';

export async function getMostRecentTransactionDate(): Promise<Date | null> {
	const response = await getSheetData(sheetInfo.sheets.readOnlyAutoTransactions, 1, 1);
	const mostRecentDate = response[0]?.date;

	if (!mostRecentDate || isNaN(new Date(mostRecentDate).getTime())) {
		return null;
	}

	return new Date(mostRecentDate);
}
