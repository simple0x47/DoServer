export class Auth0TokenRepository {
    private token: string = "";

    public get Token(): string {
        return this.token;
    }

    public constructor(private readonly url: string,
        private readonly clientId: string,
        private readonly clientSecret: string,
        private readonly audience: string) {
        this.getTokenFromAuth0();
        // Get a new token every 23 hours, since the access token expires after 24 hours.
        setInterval(() => this.getTokenFromAuth0(), 82800000);
    }

    private getTokenFromAuth0() {
        try {
            fetch(this.url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        'client_id': this.clientId,
                        'client_secret': this.clientSecret,
                        'audience': this.audience,
                        'grant_type': 'client_credentials'
                    }
                )
            }).then(response => response.json())
                .then(value => {
                    this.token = value.access_token as string;
                });
        } catch (error) {
            console.error("[Auth0 Token Repository] error: " + error);
        }
    }
}