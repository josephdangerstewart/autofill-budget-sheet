import * as dotenv from 'dotenv';
dotenv.config();

import { program } from 'commander';

import { runBudgetImport } from './runBudgetImport';
import { reclassifyTransactions } from './reclassifyTransactions';

program
	.command('import')
	.description('imports transactions into the budgeting sheet and creates monthly sheets')
	.action(() => runBudgetImport());

program
	.command('reclassify')
	.description('reclassifies manually reviewed transactions')
	.action(() => reclassifyTransactions());

program.parse(process.argv);
