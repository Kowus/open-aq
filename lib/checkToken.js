const User = require("../models/user"),
    secureToken = require("secure-token");
const verifyToken = (req, res, next) => {
    let token = req.body.token,
        namespace = req.body.namespace || "App Password",
        user_hash_buff = secureToken
            .hash(Buffer.from(token), namespace)
            .toString("base64");

    User.findOne(
        {
            tokens: {
                $elemMatch: {
                    token: token
                }
            }
        },
        (err, user) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!user) {
                return res.status(401).send("Unauthorized");
            } else {
                req.user = user;
                return next(null, true);
            }
        }
    );
};

module.exports = {
    verifyToken
};
