import { google } from 'googleapis';
import * as path from 'path';

const credentialsPath = path.join(__dirname, 'serviceAccountCredentials.json');

const auth = new google.auth.GoogleAuth({
	keyFile: credentialsPath,
	scopes: [
		'https://www.googleapis.com/auth/spreadsheets',
	],
});

google.options({ auth });
