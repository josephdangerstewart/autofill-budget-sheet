import { format } from 'date-fns';
import { DataSheet } from '../types';

const monthlyBudgetTemplateSheetName = 'Monthly Budget Template';

export const sheetInfo = {
	spreadsheetId: '1ws9bzJ7jGTBsqKY-leK3JZHDSJRCGKKvBCfH7WRYgq8',
	monthlyBudgetTemplateSheetName,
	getMonthlyBudgetExpensesQuery: (fromDate: Date, toDate: Date) =>
		`=QUERY('Classified Transactions'!B4:F, "SELECT B, C, E, D, F WHERE (toDate(D) >= date '${format(fromDate, 'yyyy-MM-dd')}') AND (toDate(D) <= date '${format(toDate, 'yyyy-MM-dd')}') ORDER BY D")`,
	getMonthlyBudgetIncomeQuery: (fromDate: Date, toDate: Date) =>
		`=QUERY(Income!B4:E, "SELECT B, D WHERE C >= date '${format(fromDate, 'yyyy-MM-dd')}' AND C <= date '${format(toDate, 'yyyy-MM-dd')}' ORDER BY C")`,
	sheets: {
		monthlyBudgetTemplateExpenses: {
			name: monthlyBudgetTemplateSheetName,
			dataStartsAtRow: 6,
			columns: {
				name: 'A',
				amount: 'B',
			},
		},
		monthlyBudgetTemplateIncome: {
			name: monthlyBudgetTemplateSheetName,
			dataStartsAtRow: 6,
			columns: {
				name: 'F',
				amount: 'G'
			},
		},
		monthlyBudgetTemplateActualExpenses: {
			name: monthlyBudgetTemplateSheetName,
			dataStartsAtRow: 6,
			columns: {
				name: 'I',
				merchant: 'J',
				cost: 'K',
				date: 'L',
				category: 'M',
			},
		},
		monthlyBudgetTemplateActualIncome: {
			name: monthlyBudgetTemplateSheetName,
			dataStartsAtRow: 6,
			columns: {
				query: 'O',
			}
		},
		transactions: {
			name: 'Classified Transactions',
			dataStartsAtRow: 4,
			columns: {
				id: 'A',
				name: 'B',
				merchant: 'C',
				date: 'D',
				amount: 'E',
				category: 'F',
				wasAutoAdded: 'G',
				plaidCategories: 'H',
			}
		},
		income: {
			name: 'Income',
			dataStartsAtRow: 4,
			columns: {
				id: 'A',
				name: 'B',
				date: 'C',
				amount: 'D',
				wasAutoAdded: 'E',
			}
		},
		rules: {
			name: 'Rules',
			dataStartsAtRow: 4,
			columns: {
				behavior: 'A',
				plaidCategories: 'B',
				merchantName: 'C',
				amount: 'D',
				rawName: 'E',
			}
		},
		defaultExpenseCategories: {
			name: 'Default Expense Categories',
			dataStartsAtRow: 7,
			columns: {
				name: 'A',
				grouping: 'B',
				amount: 'C',
			}
		},
		defaultIncomeCategories: {
			name: 'Default Income Categories',
			dataStartsAtRow: 6,
			columns: {
				name: 'A',
				amount: 'B',
			}
		},
		needsManualReview: {
			name: 'Needs Manual Review',
			dataStartsAtRow: 4,
			columns: {
				id: 'A',
				name: 'B',
				merchant: 'C',
				date: 'D',
				amount: 'E',
				plaidCategories: 'F',
				manuallyEnteredCategory: 'G',
			},
		},
	},
} as const;

export function extendDataSheet<T extends Record<string, string>>(
	sheet: DataSheet<T>,
	newSheetName: string
): DataSheet<T> {
	return {
		...sheet,
		name: newSheetName,
	};
}

export function getMonthlyBudgetSheetName(dateForMonth: Date): string {
	return format(dateForMonth, 'LLL yyyy');
}
