import { google } from 'googleapis';
import sortBy = require('lodash.sortby');
import { sheetInfo } from './sheetInfo';
import { DataSheet, DataSheetRow } from '../types';

export async function getSheetData<T extends Record<string, string>>(
	sheet: DataSheet<T>,
	startRow: number,
	endRow?: number
): Promise<DataSheetRow<keyof T>[]> {
	const sheetsClient = google.sheets({ version: 'v4' });

	const response = await sheetsClient.spreadsheets.values.get({
		spreadsheetId: sheetInfo.spreadsheetId,
		range: getRange(sheet, startRow, endRow),
	});

	const values = response.data.values.map(row => {
		return Object
			.entries(sheet.columns)
			.map(([keyName, columnName]) => ({
				keyName,
				value: row[columnNameToIndex(columnName)],
			}))
			.reduce<Record<string, string>>((obj, cur) => {
				obj[cur.keyName] = cur.value;
				return obj;
			}, {});
	});

	return values as DataSheetRow<keyof T>[];
}

function getRange<T extends Record<string, string>>(
	sheet: DataSheet<T>,
	startRow: number,
	endRow?: number
): string {
	const columnsWithIndices = Object
		.values(sheet.columns)
		.map(columnName => ({
			index: columnNameToIndex(columnName),
			columnName,
		}));

	const endColumn = sortBy(columnsWithIndices, ['index']).reverse()[0].columnName;

	return `'${sheet.name}'!A${startRow + sheet.dataStartsAtRow - 1}:${endColumn}${endRow || endRow === 0 ? endRow + sheet.dataStartsAtRow - 1 : ''}`;
}

function columnNameToIndex(name: string): number {
	if (!/^[A-Z]+$/.test(name)) {
		throw new Error(`Column names must be letters only, got "${name}"`);
	}

	return name
		.toLowerCase()
		.split('')
		.map(x => x.charCodeAt(0) - 96)
		.reverse()
		.map((x, i) => x * 26**i)
		.reduce((total, cur) => total + cur) - 1;
}
