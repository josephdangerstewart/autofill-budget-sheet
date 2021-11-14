import { tryReadCachedAccessToken, cacheAccessToken } from './accessTokenCache';
import { getAccessTokenFromUser } from './accessTokenServer';


export async function getAccessToken(allowFastify: boolean) {
	if (process.env.PLAID_ACCESS_TOKEN) {
		return process.env.PLAID_ACCESS_TOKEN;
	}

	const [didReadCache, cachedAccessToken] = tryReadCachedAccessToken();

	if (didReadCache) {
		return cachedAccessToken;
	}

	if (!allowFastify) {
		throw new Error('Could not get plaid access token');
	}

	const accessToken = await getAccessTokenFromUser();
	cacheAccessToken(accessToken);

	return accessToken;
}
