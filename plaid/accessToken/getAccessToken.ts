import { tryReadCachedAccessToken, cacheAccessToken } from './accessTokenCache';
import { getAccessTokenFromUser } from './accessTokenServer';


export async function getAccessToken() {
	const [didReadCache, cachedAccessToken] = tryReadCachedAccessToken();

	if (didReadCache) {
		return cachedAccessToken;
	}

	const accessToken = await getAccessTokenFromUser();
	cacheAccessToken(accessToken);

	return accessToken;
}
