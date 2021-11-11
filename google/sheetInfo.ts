export const sheetInfo = {
	spreadsheetId: '1ws9bzJ7jGTBsqKY-leK3JZHDSJRCGKKvBCfH7WRYgq8',
	sheets: {
		readOnlyAutoTransactions: {
			name: 'Auto Classified Transactions',
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
				defaultAmount: 'C',
			}
		},
		defaultIncomeCategories: {
			name: 'Default Income Categories',
			dataStartsAtRow: 6,
			columns: {
				name: 'A',
				expectedAmount: 'B',
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
				plaidCategories: 'F'
			}
		}
	},
} as const;