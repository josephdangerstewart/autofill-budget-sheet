export interface PlaidTransaction {
	categories: string[];
	amount: number;
	id: string;
	date: Date;
	merchantName: string;
	rawName: string;
}

export interface Transaction extends Omit<PlaidTransaction, 'categories'> {
	plaidCategories: string[];
	category: string;
}

export interface DataSheet<T extends Record<string, string>> {
	dataStartsAtRow: number;
	name: string;
	columns: T;
}

export type DataSheetRow<T extends string | number | symbol> = {
	[key in T]: string | undefined;
}

export type StringMatchingRule = {
	value?: string;
	isApproximate?: boolean;
	any?: StringMatchingRule[];
	all?: StringMatchingRule[];
}

export type NumberMatchingRule = {
	value: number;
	operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
}

export interface ClassificationRule {
	behavior: string;

	categories?: StringMatchingRule;
	merchantName?: StringMatchingRule;
	amount?: NumberMatchingRule;
	rawName?: StringMatchingRule;
}

export type SuccessClassificationResult = {
	status: 'success';
	behavior: string;
	plaidTransaction: PlaidTransaction;
}

export type ErrorClassificationResult = {
	status: 'error';
	plaidTransaction: PlaidTransaction;
}

export type ClassificationResult = SuccessClassificationResult | ErrorClassificationResult;

export interface ImportResults {
	income: PlaidTransaction[];
	manualReview: PlaidTransaction[];
	classified: SuccessClassificationResult[];
}

export interface OverspendingReport {
	category: string;
	excessAmount: number;
	totalSpent: number;
}
