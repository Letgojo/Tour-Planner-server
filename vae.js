"use strict";

const firebase = require("./firebase");
const firestore = require("./firestore");
const router = require("express").Router();
const request = require("request");

router.get("/cluster-result", (req, res) => {
  firestore
    .getData("클러스터 결과")
    .then((result) => {
      //   const temp = Object.keys(result.data());
      const resultList = [];

      resultList.le

      for (let i = 0; i < 5; i++) {
        let temp = Object.keys(result[i]);
        shuffle(temp);

        resultList.push(temp.slice(0, 10));
      }

      // console.log(resultList);
      res.status(200).send(resultList);
      console.log("cluster result Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomPosition = Math.floor(Math.random() * (index + 1));

    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }
}

module.exports = router;
