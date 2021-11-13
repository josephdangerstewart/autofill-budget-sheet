import * as dotenv from 'dotenv';
dotenv.config();

import { program } from 'commander';

import { runBudgetImport } from './runBudgetImport';
import { reclassifyTransactions } from './reclassifyTransactions';

function withErrorHandling(action: () => Promise<any>) {
	return async () => {
		try {
			await action();
		} finally {
			process.exit(0);
		}
	} 
}

program
	.command('import')
	.description('imports transactions into the budgeting sheet and creates monthly sheets')
	.action(withErrorHandling(runBudgetImport));

program
	.command('reclassify')
	.description('reclassifies manually reviewed transactions')
	.action(withErrorHandling(reclassifyTransactions));

program.parse(process.argv);
