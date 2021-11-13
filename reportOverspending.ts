import { getOverspendingReportsForCurrentMonth } from './google';
import { sendOverspendingMessage } from './discord';
import { getMonthlyBudgetSheetUrl } from './google/getMonthlyBudgetSheetUrl';

export async function reportOverspending() {
	const dateForMonth = new Date();
	const reports = await getOverspendingReportsForCurrentMonth();
	const sheetUrl = await getMonthlyBudgetSheetUrl(dateForMonth);

	if (reports.length > 0) {
		await sendOverspendingMessage(reports, sheetUrl);
	}
}
