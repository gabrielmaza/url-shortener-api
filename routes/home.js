const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const urls = [
    {
      origin: "www.google.com/loremipsumdorem-loremipsumdorem",
      shortUrl: "short.com/1",
    },
    {
      origin: "www.twitter44.com/loremipsumdorem-twitter44",
      shortUrl: "short.com/2",
    },
    {
      origin: "www.myblogurl.com/loremipsumdorem-myblogurl",
      shortUrl: "short.com/3",
    },
    {
      origin: "www.anotherlongurl.com/loremipsumdorem-anotherlongurl",
      shortUrl: "short.com/4",
    },
  ];

  res.render("home", { urls: urls });
});

module.exports = router;
