import * as dotenv from 'dotenv';
dotenv.config();

import { runBudgetImport } from './runBudgetImport';
import { reclassifyTransactions } from './reclassifyTransactions';

async function main() {
	// await runBudgetImport();
	await reclassifyTransactions();
}

main();
