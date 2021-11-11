import * as dotenv from 'dotenv';
dotenv.config();

import { addTransactionsToSheet } from './addTransactionsToSheet';

async function main() {
	await addTransactionsToSheet()
}

main();
