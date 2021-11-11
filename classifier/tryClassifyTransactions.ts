import { ClassificationRule, PlaidTransaction, Transaction, StringMatchingRule, NumberMatchingRule } from '../types';

type SuccessClassificationResult = {
	status: 'success';
	behavior: string;
	plaidTransaction: PlaidTransaction;
}

type ErrorClassificationResult = {
	status: 'error';
	plaidTransaction: PlaidTransaction;
}

type ClassificationResult = SuccessClassificationResult | ErrorClassificationResult;

export function tryClassifyTransactions(transactions: PlaidTransaction[], rules: ClassificationRule[]): ClassificationResult[] {
	return transactions.map(x => tryClassifyTransaction(x, rules));
}

function tryClassifyTransaction(transaction: PlaidTransaction, rules: ClassificationRule[]): ClassificationResult {
	const firstMatchingRule = rules.find(x => matchesRule(transaction, x));

	if (!firstMatchingRule) {
		return {
			status: 'error',
			plaidTransaction: transaction,
		};
	}

	return {
		status: 'success',
		plaidTransaction: transaction,
		behavior: firstMatchingRule.behavior,
	};
}

function matchesRule(transaction: PlaidTransaction, rule: ClassificationRule): boolean {
	const results = [
		transaction.categories.some((t) => matchesStringRule(t, rule.categories)),
		matchesStringRule(transaction.merchantName, rule.merchantName),
		matchesStringRule(transaction.rawName, rule.rawName),
		matchesNumberRule(transaction.amount, rule.amount),
	];

	return results.every(x => x);
}

function matchesStringRule(value: string, rule: StringMatchingRule | undefined): boolean {
	if (!rule) {
		return true;
	}

	if (rule.value && rule.isApproximate) {
		return Boolean(value?.toLowerCase().includes(rule.value?.toLowerCase()));
	}

	if (rule.value) {
		return value?.toLowerCase() === rule.value?.toLowerCase();
	}

	if (rule.any) {
		return rule.any.some((x) => matchesStringRule(value, x));
	}

	if (rule.all) {
		return rule.all.every((x) => matchesStringRule(value, x));
	}

	return false;
}

function matchesNumberRule(value: number, rule: NumberMatchingRule | undefined): boolean {
	if (!rule) {
		return true;
	}

	switch (rule.operator) {
		case 'lte':
			return value <= rule.value;
		case 'lt':
			return value < rule.value;
		case 'gte':
			return value >= rule.value;
		case 'gt':
			return value > rule.value;
		case 'eq':
		default:
			return value === rule.value;
	}
}
