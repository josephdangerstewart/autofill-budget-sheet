import { ImportResults } from '../types';
import { sendDiscordMessage } from './sendDiscordMessage';
import { discordChannels } from './discordChannels';

export async function sendImportNotifications(results: ImportResults) {
	const hasAnyTransactions =
		results.classified.length ||
		results.income.length ||
		results.manualReview.length;

	const totalClassifiedAmount = results
		.classified
		?.reduce((total, cur) => total + cur.plaidTransaction.amount, 0) ?? 0;
	
	const totalManualReviewAmount = results
		.manualReview
		?.reduce((total, cur) => total + cur.amount, 0) ?? 0;
	
	const totalIncomeAmount = results
		.income
		?.reduce((total, cur) => total + cur.amount, 0) ?? 0;

	const summary = `Budget import ran successfully ($${totalClassifiedAmount + totalManualReviewAmount} total spent, $${totalIncomeAmount} total earned)
${hasAnyTransactions
? `
Classified transactions: **${results.classified.length}** ($${totalClassifiedAmount})
Needs manual review: **${results.manualReview.length}** (${totalManualReviewAmount})
Income transactions: **${results.income.length}** (${totalIncomeAmount})`
: '*No new transactions*'}`;

	const promises = [sendDiscordMessage(discordChannels.runtimeSummary, summary)];

	if (results.manualReview?.length > 0) {
		const needsManualReviewMessage = `**${results.manualReview.length}** new transactions need manual review
https://docs.google.com/spreadsheets/d/1ws9bzJ7jGTBsqKY-leK3JZHDSJRCGKKvBCfH7WRYgq8/edit#gid=1905165095`;

		promises.push(sendDiscordMessage(discordChannels.manualReviewNeeded, needsManualReviewMessage));
	}

	await Promise.all(promises);
}
