import fs from 'fs';
import path from 'path';

export function tryReadCachedAccessToken(): [boolean, string | null] {
	const accessTokenFile = path.join(__dirname, 'plaidAccessToken.json');

	if (!fs.existsSync(accessTokenFile)) {
		return [false, null];
	}

	try {
		const rawContent = fs.readFileSync(accessTokenFile, { encoding: 'utf-8' });
		const jsonContent = JSON.parse(rawContent);
		return [true, jsonContent.token];
	} catch {
		return [false, null];
	}
}

export function cacheAccessToken(accessToken: string) {
	const accessTokenFile = path.join(__dirname, 'plaidAccessToken.json');
	fs.writeFileSync(accessTokenFile, JSON.stringify({ token: accessToken }), { encoding: 'utf-8' });
}
