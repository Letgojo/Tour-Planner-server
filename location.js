"use strict";

const firebase = require("./firebase");
const firestore = require("./firestore");
const router = require("express").Router();

router.get("/", (req, res) => {
  const option = req.query;
  console.log("gaag");
  firestore
    .getData("자연관광", "")
    .then((result) => {
      result.forEach((doc) => {
        console.log(doc.data());
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
