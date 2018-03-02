const secureToken = require('secure-token');






module.exports = {
    create: () => {
        let sessionToken = secureToken.create(30);
        return sessionToken;
    }
}