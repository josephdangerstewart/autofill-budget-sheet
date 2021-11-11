import { ClassificationRule, DataSheetRow, StringMatchingRule, NumberMatchingRule } from '../types';
import { sheetInfo } from './sheetInfo';
import { getSheetData } from './getSheetData';

type RuleSheetRow = DataSheetRow<keyof typeof sheetInfo['sheets']['rules']['columns']>;

export async function getRules(): Promise<ClassificationRule[]> {
	const data = await getSheetData(sheetInfo.sheets.rules, 1);
	return data.map(x => {
		if (!x.behavior) {
			console.error(`Got a rule with no behavior: ${JSON.stringify(x, null, 2)}`);
			return null;
		}

		if (!x.plaidCategories && !x.merchantName && !x.rawName && !x.amount) {
			console.error(`Got a rule with no conditions: ${JSON.stringify(x, null, 2)}`);
			return null;
		}

		const parsed = mapToClassificationRule(x);

		if (!parsed.categories && !parsed.merchantName && !parsed.rawName && !parsed.amount) {
			console.error(`Got a rule with no conditions: ${JSON.stringify(x, null, 2)}`);
			return null;
		}

		return parsed;
	}).filter(Boolean);
}

function mapToClassificationRule(row: RuleSheetRow): ClassificationRule {
	return {
		behavior: row.behavior,
		categories: parseStringSyntax(row.plaidCategories),
		merchantName: parseStringSyntax(row.merchantName),
		rawName: parseStringSyntax(row.rawName),
		amount: parseNumberSyntax(row.amount),
	};
}

function parseNumberSyntax(value: string): NumberMatchingRule | undefined {
	if (!value || value.trim() === '') {
		return;
	}

	const match = /(>=|>|<=|<|=)*([0-9]+(\.[0-9])*)/.exec(value);

	if (!match) {
		console.error(`Got a bad number expression: ${value}`);
		return;
	}

	const [, operator, rawNumber] = match;

	const number = parseFloat(rawNumber);

	if (isNaN(number)) {
		console.error(`Could not parse number expression: ${value}`);
		return;
	}

	const operationName = operatorToOperationName[operator as keyof typeof operatorToOperationName];

	if (!operationName) {
		return;
	}

	return {
		value: number,
		operator: operationName,
	};
}

const operatorToOperationName = {
	'=': 'eq',
	'<': 'lt',
	'<=': 'lte',
	'>': 'gt',
	'>=': 'gte',
} as const;

function parseStringSyntax(value: string): StringMatchingRule | undefined {
	if (value === undefined || value === null) {
		return;
	}

	if (value.trim() === '') {
		return;
	}

	const ors = value.split(/(?<!\\)(?:\\\\)*\|/);

	return {
		any: ors.map((or) => {
			const ands = cleanEscapeCharacters(or, '|').split(/(?<!\\)(?:\\\\)*,/);

			return {
				all: ands.map((x) => {
					const isApproximate = x.startsWith('~');

					let dirtyValue = x;
					if (isApproximate) {
						dirtyValue = dirtyValue.substring(1);
					}
					const cleanValue = cleanEscapeCharacters(dirtyValue, '~', ',', '\\');

					return {
						value: cleanValue,
						isApproximate,
					};
				})
			}
		}),
	}
}

function cleanEscapeCharacters(value: string, ...specialCharacters: string[]): string {
	let result = value;
	for (const specialCharacter of specialCharacters) {
		result = result.replace(new RegExp(`\\\\${specialCharacter.replace(/\\/g, '\\\\').replace(/\|/, '\\|')}`, 'g'), specialCharacter);
	}
	return result;
}
