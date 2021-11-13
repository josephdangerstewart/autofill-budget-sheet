import { getMonthlyBudgetSheetName, sheetInfo } from './sheetInfo';
import { google } from 'googleapis';

export async function getMonthlyBudgetSheetUrl(dateForMonth: Date): Promise<string> {
	const sheetsClient = google.sheets({ version: 'v4' });

	const monthlyBudgetSheetName = getMonthlyBudgetSheetName(dateForMonth);

	const response = await sheetsClient.spreadsheets.get({
		spreadsheetId: sheetInfo.spreadsheetId,
	});

	const monthlyBudgetSheet = response
		.data
		.sheets
		.find(x => x.properties?.title === monthlyBudgetSheetName);
	
	const sheetId = monthlyBudgetSheet?.properties?.sheetId;

	if (!sheetId) {
		return null;
	}

	return `https://docs.google.com/spreadsheets/d/${sheetInfo.spreadsheetId}/edit#gid=${sheetId}`;
}
