# eve-sso-simple
Simple promise-based node.js module simplifying EVE Online's SSO authentication flow.


## Usage
```
var esso = require('eve-sso-simple');

router.get('/', (req, res) => {
    
    esso.login(
        {
            client_id: 'registered app's client id',
            client_secret: 'registered app's client secret',
            redirect_uri: 'http://localhost:1337/login/callback',
            scope: 'publicData characterFittingsRead characterFittingsWrite ...'
        }, res);
});

router.get('/callback', (req, res) => {
    
    // Returns a promise - resolves into a JSON object containing access and character token.
    esso.getTokens({
        client_id: 'registered app's client id',
        client_secret: 'registered app's client secret'
        }, req, res, 
        (accessToken, charToken) => {
            res.send({access_token: accessToken, character_token: charToken})
        }
    );

});
```

## Update
2.0.0
Separated the login (redirect) and callback (getting tokens) logic. 
Now uses callback to process the fetched access and character tokens instead of encoding and saving them directly as cookies.
