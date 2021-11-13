import { DataSheet, DataSheetRow } from '../../types';
import sortBy = require('lodash.sortby');

export function buildRow<T extends Record<string, string>>(
	sheet: DataSheet<T>,
	rowData: DataSheetRow<keyof T>,
	columns: { keyName: string, index: number }[]
): string[] {
	const result = [];
	for (const column of columns) {
		result[column.index] = rowData[column.keyName as keyof DataSheetRow<keyof T>];
	}
	return result;
}


export function getRange<T extends Record<string, string>>(
	sheet: DataSheet<T>,
	startRow: number,
	endRow?: number
): string {
	const columnsWithIndices = Object
		.values(sheet.columns)
		.map(columnName => ({
			index: columnNameToIndex(sheet, columnName),
			columnName,
		}));

	const endColumn = sortBy(columnsWithIndices, ['index']).reverse()[0].columnName;
	const startColumn = sortBy(columnsWithIndices, ['index'])[0].columnName;

	return `'${sheet.name}'!${startColumn}${startRow + sheet.dataStartsAtRow - 1}:${endColumn}${endRow || endRow === 0 ? endRow + sheet.dataStartsAtRow - 1 : ''}`;
}

export function columnNameToIndex<T extends Record<string, string>>(sheet: DataSheet<T>, name: string): number {
	const columnsWithIndices = Object
		.values(sheet.columns)
		.map(columnName => ({
			index: columnNameToRawIndex(columnName),
			columnName,
		}));

	const startColumn = sortBy(columnsWithIndices, ['index'])[0].columnName;
	const startColumnIndex = columnNameToRawIndex(startColumn);

	return columnNameToRawIndex(name) - startColumnIndex;
}

function columnNameToRawIndex(name: string): number {
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

export function parseDollars(dollars: string): number {
	const match = /[^0-9]*([0-9]+\.[0-9]+?)$/.exec(dollars);

	if (!match) {
		return NaN;
	}

	return parseFloat(match[1]);
}
