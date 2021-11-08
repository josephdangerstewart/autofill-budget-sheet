import fastify, { FastifyInstance } from 'fastify';
import open from 'open';
import path from 'path';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import fastifyStatic from 'fastify-static';

const plaidConfiguration = new Configuration({
	basePath: PlaidEnvironments[process.env.PLAID_ENV as string],
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
			'PLAID-SECRET': process.env.PLAID_SECRET,
		},
	},
});

const plaidClient = new PlaidApi(plaidConfiguration);

export const ACCESS_TOKEN_SERVER_PORT = process.env.PORT ?? 8080;

export async function getAccessTokenFromUser() {
	const serverInstance = fastify({ logger: false });

	serverInstance.register(fastifyStatic, {
		root: path.join(__dirname, '/static'),
	});

	serverInstance.get('/', (_, reply) => {
		reply.sendFile('index.html');
	});

	const accessTokenPromise = waitForAccessToken(serverInstance);

	await serverInstance.listen(process.env.PORT ?? 8080);
	open(`http://localhost:${process.env.PORT ?? 8080}`);

	return await accessTokenPromise;
}

function waitForAccessToken(server: FastifyInstance): Promise<string> {
	let resolveAccessTokenPromise: (token: string) => void;
	let isResolved = false;
	const accessTokenPromise = new Promise<string>((resolve) => {
		resolveAccessTokenPromise = resolve;
	});

	server.post('/plaid/linkToken', async  () => {
		return await generateLinkToken();
	});

	server.post('/plaid/makeAccessToken', async (request, reply) => {
		if (isResolved) {
			reply.status(409).send();
			return;
		}

		const { publicToken } = (request.query as any);

		if (typeof publicToken !== 'string') {
			reply.status(400).send();
			return;
		}

		const accessToken = await getAccessTokenFromPublicToken(publicToken);
		isResolved = true;
		resolveAccessTokenPromise(accessToken);
		reply.status(200).send();
		server.close();
	});

	return accessTokenPromise;
}

async function generateLinkToken() {
	const request = {
		user: {
		  // This should correspond to a unique id for the current user.
		  client_user_id: 'dev-1',
		},
		client_name: 'Hive Budget App',
		products: [Products.Auth, Products.Transactions],
		language: 'en',
		country_codes: [CountryCode.Us],
	};
	try {
		const createTokenResponse = await plaidClient.linkTokenCreate(request);
		console.log(createTokenResponse);
		return {
			linkToken: createTokenResponse.data.link_token,
		};
	} catch (err) {
		console.error(JSON.stringify(err, null, 2));
	}
}

async function getAccessTokenFromPublicToken(publicToken: string) {
	const response = await plaidClient.itemPublicTokenExchange({
		public_token: publicToken,
	});
	return response.data.access_token;
}
