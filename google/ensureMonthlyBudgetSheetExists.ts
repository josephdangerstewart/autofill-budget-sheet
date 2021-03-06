import { google } from 'googleapis';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { sheetInfo, extendDataSheet, getMonthlyBudgetSheetName } from './sheetInfo';
import { updateSheetData, addSheetData, getSheetData } from './sheetManipulation';

export async function ensureMonthlyBudgetSheetExists(dateForMonth: Date): Promise<void> {
	const sheets = google.sheets({ version: 'v4' });

	const spreadsheet = await sheets.spreadsheets.get({
		spreadsheetId: sheetInfo.spreadsheetId,
	});

	const monthlyBudgetSheetName = getMonthlyBudgetSheetName(dateForMonth);

	if (spreadsheet.data.sheets.some(x => x.properties.title === monthlyBudgetSheetName)) {
		return;
	}

	const monthlyBudgetSheetId = spreadsheet
		.data
		.sheets
		.find(x => x.properties.title === sheetInfo.monthlyBudgetTemplateSheetName)
		?.properties
		?.sheetId;
	
	if (!monthlyBudgetSheetId) {
		throw new Error('Could not find monthly budget template sheet');
	}

	await sheets.spreadsheets.batchUpdate({
		spreadsheetId: sheetInfo.spreadsheetId,
		requestBody: {
			requests: [
				{
					duplicateSheet: {
						sourceSheetId: monthlyBudgetSheetId,
						newSheetName: format(dateForMonth, 'LLL yyyy'),
					}
				}
			]
		},
	});

	const [defaultIncome, defaultExpenses] = await Promise.all([
		getSheetData(sheetInfo.sheets.defaultIncomeCategories, 1),
		getSheetData(sheetInfo.sheets.defaultExpenseCategories, 1),
	]);

	const newIncomeSheet = extendDataSheet(
		sheetInfo.sheets.monthlyBudgetTemplateIncome,
		monthlyBudgetSheetName
	);
	const newExpenseSheet = extendDataSheet(
		sheetInfo.sheets.monthlyBudgetTemplateExpenses,
		monthlyBudgetSheetName,
	);
	const actualIncomeSheet = extendDataSheet(
		sheetInfo.sheets.monthlyBudgetTemplateActualIncome,
		monthlyBudgetSheetName,
	);
	const actualExpenseSheet = extendDataSheet(
		sheetInfo.sheets.monthlyBudgetTemplateActualExpenses,
		monthlyBudgetSheetName
	);

	const monthStart = startOfMonth(dateForMonth);
	const monthEnd = endOfMonth(dateForMonth);

	const incomeQuery = sheetInfo.getMonthlyBudgetIncomeQuery(monthStart, monthEnd);
	const expensesQuery = sheetInfo.getMonthlyBudgetExpensesQuery(monthStart, monthEnd);

	await Promise.all([
		await addSheetData(newIncomeSheet, defaultIncome),
		await addSheetData(newExpenseSheet, defaultExpenses),
		await updateSheetData(actualIncomeSheet, 1, { query: incomeQuery }),
		await updateSheetData(actualExpenseSheet, 1, {
			name: expensesQuery,
			merchant: null,
			cost: null,
			date: null,
			category: null,
		}),
	]);
}
