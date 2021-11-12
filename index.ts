import * as dotenv from 'dotenv';
dotenv.config();

import { addTransactionsToSheet } from './addTransactionsToSheet';
import { ensureMonthlyBudgetSheetExists } from './google';

async function main() {
	await ensureMonthlyBudgetSheetExists(new Date());
	// await addTransactionsToSheet()
}

main();
