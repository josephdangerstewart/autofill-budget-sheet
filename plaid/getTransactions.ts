import { Transaction as RawTransaction } from 'plaid';
import { plaidClient } from './plaidClient';
import { format } from 'date-fns';
import { PlaidTransaction } from '../types';

export async function getTransactions(accessToken: string, fromDateUtc: Date): Promise<PlaidTransaction[]> {
	const startDate = format(fromDateUtc, 'yyyy-MM-dd');
	const endDate = format(new Date(), 'yyyy-MM-dd');

	let response = await plaidClient.transactionsGet({
		access_token: accessToken,
		start_date: startDate,
		end_date: endDate,
		options: {
			count: 500,
		}
	});
	const totalTransactions = response.data.total_transactions;
	const allTransactions = response.data.transactions.map(mapTransaction);

	while (allTransactions.length < totalTransactions) {
		response = await plaidClient.transactionsGet({
			access_token: accessToken,
			start_date: startDate,
			end_date: endDate,
			options: {
				count: 500,
				offset: allTransactions.length,
			},
		});

		allTransactions.push(...response.data.transactions.map(mapTransaction));
	}

	return allTransactions;
}

function mapTransaction(source: RawTransaction): PlaidTransaction {
	return {
		id: source.transaction_id,
		categories: source.category,
		amount: source.amount,
		date: new Date(source.date),
		merchantName: source.merchant_name,
	};
}
