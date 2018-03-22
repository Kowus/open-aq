const express = require("express"),
  router = express.Router(),
  tokenizer = require("../lib/generate-token");

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.get("/generate-token", (req, res, next) => {
  let token = tokenizer.create();
  res.json({ token: token });
});

module.exports = router;
