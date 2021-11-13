import { OverspendingReport } from '../types';
import { sendDiscordMessage } from './sendDiscordMessage';
import { discordChannels } from './discordChannels';

export async function sendOverspendingMessage(reports: OverspendingReport[], monthlyBudgetSheetUrl: string): Promise<void> {
	const message = `**:warning: Overspending Warning! :warning:**

${reports.map(formatReport).join('\n')}${monthlyBudgetSheetUrl ? `

${monthlyBudgetSheetUrl}` : ''}`;

	await sendDiscordMessage(discordChannels.overspendingWarning, message);
}

function formatReport(report: OverspendingReport): string {
	return `- **${report.category}:** Over by **${formatMoney(report.excessAmount)}** (${formatMoney(report.totalSpent)} total)`;
}

function formatMoney(money: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		currency: 'USD',
		style: 'currency',
	});

	return formatter.format(money);
}