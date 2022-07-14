export const AppConfig = {
	APP_BASE_URL: 'https://stage2.clickguard.com'
}

export const ApiConfig = {
	API_BASE_URL: 'https://stage2.clickguard.com/api'
}

export const GoogleAuthConfig = {
	AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadwords%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=456310919448-dj4kvl1us6ct7sjun9pr6p9g9oktv36p.apps.googleusercontent.com&redirect_uri=https://stage2.clickguard.com/oauth/google'
}

export const StripeConfig = {
	publicKey: 'pk_test_niklGZPmPAGbafh6tnHkKVB6'
}

export const Auth0Config = {
	domain: 'dev-lsbg5leb.us.auth0.com',
	client_id: 'lPgAOCvlK9et7xn3ZyYCoFjYXPqNxbfX',
	audience: 'ApiClickGuardDev',
	scope: 'read:current_user update:current_user_metadata'
}
