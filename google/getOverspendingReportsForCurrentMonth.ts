import { OverspendingReport } from '../types';
import { getMonthlyBudgetSheetName, extendDataSheet, sheetInfo } from './sheetInfo';
import { ensureMonthlyBudgetSheetExists } from './ensureMonthlyBudgetSheetExists';
import { getSheetData, parseDollars } from './sheetManipulation';

export async function getOverspendingReportsForCurrentMonth(): Promise<OverspendingReport[]> {
	const dateForMonth = new Date();
	await ensureMonthlyBudgetSheetExists(dateForMonth);

	const currentMonthSheetName = getMonthlyBudgetSheetName(dateForMonth);
	const expenseCategoriesSheet = extendDataSheet(
		sheetInfo.sheets.monthlyBudgetTemplateExpenses,
		currentMonthSheetName
	);
	const actualExpensesSheet = extendDataSheet(
		sheetInfo.sheets.monthlyBudgetTemplateActualExpenses,
		currentMonthSheetName,
	);

	const budgetedExpenses = await getSheetData(expenseCategoriesSheet, 1);
	const actualExpenses = await getSheetData(actualExpensesSheet, 1);

	const totalBudgetedByCategory = budgetedExpenses.reduce<Record<string, number>>((map, cur) => {
		if (!cur.name) {
			return map;
		}

		map[cur.name] = parseDollars(cur.amount);
		return map;
	}, {});
	const totalExpensesByCategory = actualExpenses.reduce<Record<string, number>>((map, cur) => {
		if (!cur.category) {
			return map;
		}

		map[cur.category] = parseDollars(cur.cost);
		return map;
	}, {});

	return Object
		.entries(totalBudgetedByCategory)
		.map(([category, expectedCost]) => ({
			category,
			left: expectedCost - (totalExpensesByCategory[category] ?? 0),
			totalSpent: totalExpensesByCategory[category] ?? 0,
		}))
		.filter(x => x.left < 0)
		.map(({ category, left, totalSpent }) => ({
			category,
			excessAmount: Math.abs(left),
			totalSpent,
		}));
}
