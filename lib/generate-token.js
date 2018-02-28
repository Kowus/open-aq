const secureToken = require('secure-token');

let ses_tok = secureToken.create();





module.exports = {
    create: () => {
        let sessionToken = secureToken.create(30);
        return sessionToken;
    }
}