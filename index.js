const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.com/sport/olympics",
    base: "https://www.thetimes.com",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/sport/olympic-games",
    base: "https://www.theguardian.com",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/sport/olympics",
    base: "https://www.bbc.com",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/sport/olympics/",
    base: "https://www.thesun.co.uk",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/olympics/",
    base: "https://www.telegraph.co.uk/",
  },
  {
    name: "dailymail",
    address: "https://www.dailymail.co.uk/sport/olympics/index.html",
    base: "https://www.dailymail.co.uk",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Olympic")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Olympic News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("Olympic")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
