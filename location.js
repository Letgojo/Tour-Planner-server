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

router.get("/recommand-route", (req, res) => {
  // 관광 타입마다 골고루 섞어서 넣기
  const options = req.query;
  //options.days = 3;
  let jsonResult = [];
  let randomList = [];
  let restaurantList = [];

  firestore
    .getData(options.tourType, options)
    .then((result) => {
      result.forEach((doc) => {
        const temp = doc.data();
        jsonResult.push(temp);
      });

      shuffle(jsonResult);

      for (let i = 0; i < options.days * 2; i++) {
        randomList[i] = jsonResult[i];
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });

  firestore
    .getData("음식점", options)
    .then((result) => {
      result.forEach((doc) => {
        const temp = doc.data();

        temp["이름"] = doc.id;
        restaurantList.push(temp);
      });

      shuffle(restaurantList);

      for (let i = 0; i < options.days * 3; i++) {
        randomList.push(restaurantList[i]);
      }

      res.status(200).send(randomList);
      console.log("recommand-tour Info Sended!");
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
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
