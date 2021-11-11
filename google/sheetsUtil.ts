import { DataSheet } from '../types';
import sortBy = require('lodash.sortby');

export function getRange<T extends Record<string, string>>(
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

export function columnNameToIndex(name: string): number {
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
