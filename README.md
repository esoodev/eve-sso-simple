# eve-sso-simple
Simple promise-based node.js module simplifying EVE Online's SSO authentication flow.
Please email me for bugs/suggestions! 

## Usage
```
var esso = require('eve-sso-simple');

router.get('/', (req, res) => {
    
    async function login(req, res) {

        var tokens = await esso.login(  
            // Tokens (JWT) encoded using 'token_secret,' then saved as cookies.
            // Redirects to SSO login page if not logged in.
            {
                // Fill in below the application details registered on the dev page.
                client_id: ...,         
                client_secret: ..., 
                redirect_uri: ...,   
                scope: ...,                 
                token_secret: 'secret'  // For jwt encoding.
            }
            , req, res);

        if (tokens)
            res.send(tokens);
    };

    login(req, res);

});
```
