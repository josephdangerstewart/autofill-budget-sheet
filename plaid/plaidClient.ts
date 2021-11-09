import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

const plaidConfiguration = new Configuration({
	basePath: PlaidEnvironments[process.env.PLAID_ENV as string],
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
			'PLAID-SECRET': process.env.PLAID_SECRET,
		},
	},
});

export const plaidClient = new PlaidApi(plaidConfiguration);
