"use strict";

const firebase = require("./firebase");
const firestore = require("./firestore");
const router = require("express").Router();

router.get("/tour", (req, res) => {
  const options = req.query;
  firestore
    .getData(options.tourType, options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        jsonResult.push(doc.data());
      });

      res.status(200).send(jsonResult);
      console.log("Tour Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

router.get("/restaurant", (req, res) => {
  const options = req.query;
  console.log(options);
  firestore
    .getData("음식점", options)
    .then((result) => {
      let jsonResult = [];

      result.forEach((doc) => {
        const temp = doc.data();
        temp["이름"] = doc.id;
        jsonResult.push(temp);
      });

      res.status(200).send(jsonResult);
      console.log("restaurant Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

module.exports = router;