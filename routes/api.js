const express = require("express"),
    router = express.Router(),
    { connect } = require("mqtt"),
    { mqtt } = require("../lib/env"),
    client = connect(mqtt.url);

router.post("/sensor", (req, res, next) => {
    client.publish(`${req.user._id}/sensor`, req.body.data, err => {
        if (err) return res.status(500).send(err.message);
        res.status(204).end();
    });
});

client.on("connect", function() {
    console.log("MQTT CLIENT CONNECTED");
});
client.on("error", function(err) {
    console.error(err);
});
module.exports = router;
