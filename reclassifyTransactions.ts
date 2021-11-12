import { getManuallyReviewedTransactions, getRules, recordClassificationResults } from './google';
import { tryClassifyTransactions } from './classifier';

export async function reclassifyTransactions(): Promise<void> {
	const manualTransactions = await getManuallyReviewedTransactions();

	const errors = manualTransactions.filter((x) => x.status === 'error').map(x => x.plaidTransaction);
	const successes = manualTransactions.filter((x) => x.status === 'success');

	const rules = await getRules();

	const newResults = tryClassifyTransactions(errors, rules);

	await recordClassificationResults([
		...newResults,
		...successes,
	]);
}
