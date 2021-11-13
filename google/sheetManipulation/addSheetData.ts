import { google } from 'googleapis';
import { DataSheet, DataSheetRow } from '../../types';
import { columnNameToIndex, getRange, buildRow } from './sheetsUtil';
import { sheetInfo } from '../sheetInfo';

export async function addSheetData<T extends Record<string, string>>(
	sheet: DataSheet<T>,
	rowData: DataSheetRow<keyof T>[]
): Promise<void> {
	const sheetsClient = google.sheets({ version: 'v4' });

	const columns = Object.entries(sheet.columns).map(([keyName, columnName]) => ({
		keyName,
		index: columnNameToIndex(sheet, columnName),
	}));

	const rawRowData = rowData.map((x) => buildRow(sheet, x, columns));

	await sheetsClient.spreadsheets.values.append({
		spreadsheetId: sheetInfo.spreadsheetId,
		range: getRange(sheet, 1),
		requestBody: {
			values: rawRowData,
		},
		valueInputOption: 'USER_ENTERED',
	});
}
