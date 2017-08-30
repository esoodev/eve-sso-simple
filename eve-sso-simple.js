var qs = require('querystring');
var request = require('request');

module.exports = {

    /**
     * Redirects to EVE SSO login page.
     */
    login: function (setup, res) {
        var query = qs.stringify(
                    {
                        response_type: "code",
                        redirect_uri: setup.redirect_uri,
                        client_id: setup.client_id,
                        scope: setup.scope
                    }
                );

                res.redirect('https://login.eveonline.com/oauth/authorize/?' + query);
    },

    /**
     * Consumes access code and fetches access and character tokens.
     */
    getTokens: function (setup, req, res, callback) {

        return new Promise((resolve, reject) => {

            var accessToken;
            var charToken;

            if (req.query.code != null) {

                request(
                    {
                        url: 'https://login.eveonline.com/oauth/token',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + new Buffer(setup.client_id + ':' + setup.client_secret).toString('base64'),
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Host': 'login.eveonline.com'
                        },
                        body: qs.stringify({
                            "grant_type": "authorization_code",
                            "code": req.query.code
                        })
                    }, function (tokenErr, tokenRes, tokenBody) {

                        if (tokenRes && (tokenRes.statusCode === 200 || tokenRes.statusCode === 201)) {

                            accessToken = JSON.parse(tokenBody);

                            request(
                                {
                                    url: 'https://login.eveonline.com/oauth/verify',
                                    method: 'GET',
                                    headers: {
                                        'User-Agent': req.headers['user-agent'],
                                        'Authorization': accessToken.token_type + ' ' + accessToken.access_token,
                                        'Host': 'login.eveonline.com'
                                    }
                                }, function (charErr, charRes, charBody) {

                                    if (charRes && (charRes.statusCode === 200 || charRes.statusCode === 201)) {

                                        charToken = JSON.parse(charBody);

                                        if (callback != null) callback(accessToken, charToken);

                                    }

                                    resolve({
                                        access_token: accessToken,
                                        character_token: charToken
                                    });
                                });
                        }
                    });
            } else if (req.cookies.access_token != null || req.cookies.character_token != null) {

                if (callback != null) callback(accessToken, charToken);

                resolve({
                    access_token: req.cookies.access_token,
                    character_token: req.cookies.character_token
                });
            }
        });
    }
}