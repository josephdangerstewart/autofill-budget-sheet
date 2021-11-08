import dotenv from 'dotenv';
dotenv.config();

import { getAccessToken } from './plaid';


async function main() {
	const plaidAccessToken = await getAccessToken();
	console.log(plaidAccessToken);
}

main();
