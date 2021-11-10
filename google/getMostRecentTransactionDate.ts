import { google } from 'googleapis';

export async function getMostRecentTransactionDate(): Promise<Date> {
	const sheetsClient = google.sheets({ version: 'v4' });

	const getSheetsResponse = await sheetsClient.spreadsheets.get({
		spreadsheetId: '1NDMqQ2PiBNUITc8W3Yois8B8KfprGityY4M0Lbjqfck',
	});

	const mostRecentSheet = getSheetsResponse
		.data
		.sheets
		.map(x => getBudgetMonthId(x.properties.title))
		.sort()
		.reverse()[0];

	// TODO: Get transaction cells from most recent sheet
	// and find most recent transaction, convert to date object
	// and return it

	return new Date();
}

function getBudgetMonthId(sheetName: string): string | null {
	const execResult = /(\w+)\s*([0-9][0-9][0-9][0-9])/.exec(sheetName);

	if (!execResult) {
		return null;
	}

	const [rawMonth, year] = execResult;

	const monthIndex = months.findIndex(x => rawMonth.toLocaleLowerCase().startsWith(x));

	if (monthIndex === -1) {
		return null;
	}

	return `${year}-${indexToString(monthIndex)}`;
}

const months = [
	'jan',
	'feb',
	'mar',
	'apr',
	'may',
	'jun',
	'jul',
	'aug',
	'sep',
	'oct',
	'nov',
	'dec',
];

function indexToString(index: number) {
	if (index <= 9) {
		return `0${index}`;
	}
	return index.toString();
}
