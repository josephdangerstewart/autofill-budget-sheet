import { Transaction as RawTransaction } from 'plaid';
import { plaidClient } from './plaidClient';
import { format, subDays, isAfter, parse } from 'date-fns';
import { PlaidTransaction } from '../types';

export async function getTransactions(accessToken: string, fromDate: Date): Promise<PlaidTransaction[]> {
	const startDate = format(fromDate, 'yyyy-MM-dd');
	const endDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');

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

	return allTransactions.filter((x) => isAfter(x.date, fromDate));
}

function mapTransaction(source: RawTransaction): PlaidTransaction {
	return {
		id: source.transaction_id,
		categories: source.category,
		amount: source.amount,
		date: parse(source.date, 'yyyy-MM-dd', new Date()),
		merchantName: source.merchant_name,
		rawName: source.name,
	};
}
