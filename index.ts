import * as dotenv from 'dotenv';
dotenv.config();

import uniqBy = require('lodash.uniqby');
import { format } from 'date-fns';
import { addTransactionsToSheet } from './addTransactionsToSheet';
import { ensureMonthlyBudgetSheetExists } from './google';

async function main() {
	const classifications = await addTransactionsToSheet();

	const uniqueMonths = uniqBy(
		classifications.map((x) => x.plaidTransaction.date),
		d => format(d, 'LLL yyyy'),
	);

	const promises = uniqueMonths.map(x => ensureMonthlyBudgetSheetExists(x));

	await Promise.all(promises);
}

main();
